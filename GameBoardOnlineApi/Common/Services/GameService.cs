using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public class GameService(ILogger<GameService> logger, IDbContextFactory<DataContext> dbContextFactory, RoomService roomService) : AService(logger, dbContextFactory)
{
    public GamePlayed InitializeGame(long roomId, long gameId)
    {
        var room = Context.Rooms
            .Include(r => r.Users)
            .FindOrThrow(roomId);
        var game = Context.Games
            .Include(g => g.EntitiesGroups)
            .ThenInclude(g => g.Entities)
            .ThenInclude(e => e.LinkTo)
            .FindOrThrow(gameId);

        if (room.Users.Count < game.MinPlayers)
        {
            throw new NotEnoughPlayersException(game.MinPlayers);
        }

        var gamePlayed = new GamePlayed
        {
            Game = game,
            Room = room
        };
        
        gamePlayed.Players = room.Users.Select(u => new Player
        {
            Game = gamePlayed,
            User = u
        }).ToList();
        
        foreach (var entityGroup in game.EntitiesGroups)
        {
            List<EntityPlayed> entitiesPlayed = [];
            
            // TODO mélanger "en place"
            entitiesPlayed.AddRange(entityGroup.Entities.Select(entity => new EntityPlayed
            {
                GamePlayed = gamePlayed,
                Entity = entity,
                X = entity.X,
                Y = entity.Y,
                Order = entity.Order,
                Rotation = entity.Rotation,
                ShowBack = entity.ShowBack,
                CanFlip = entity.CanFlip,
                OnlyForOwner = entity.OnlyForOwner
            }));

            if (entitiesPlayed.Count == 0)
            {
                throw new GameBoardOnlineException($"Erreur, aucune entité pour {entityGroup.Name} #{entityGroup.Id}");
            }
            
            foreach (var entityPlayed in entitiesPlayed)
            {
                gamePlayed.EntitiesPlayed.Add(entityPlayed);
            }
        }
            
        foreach (var entityPlayed in gamePlayed.EntitiesPlayed.Where(e => e.Entity.LinkTo != null))
        {
            entityPlayed.LinkTo = gamePlayed.EntitiesPlayed.First(e => e.Entity == entityPlayed.Entity.LinkTo);
        }

        room.CurrentGame = gamePlayed;
        
        Context.Add(gamePlayed);
        Context.SaveChanges();
        
        foreach (var entityGroup in game.EntitiesGroups.Where(g => g.Randomize))
        {
            Context.UpdateRange(
                RandomizeEntities(gamePlayed.EntitiesPlayed.Where(e => e.Entity.Group == entityGroup).ToList(), entityGroup, gamePlayed)
            );
        }
        
        Context.SaveChanges();

        roomService.SendChatMessage(roomId, $"Le jeu \"{game.Name}\" commence !");
        
        return gamePlayed;
    }

    public GamePlayed EndGame(long gamePlayedId)
    {
        var gamePlayed = Context.GamePlayed
            .Include(g => g.Room)
            .FindOrThrow(gamePlayedId);

        gamePlayed.IsFinished = true;
        gamePlayed.Room.CurrentGame = null;

        Context.Update(gamePlayed);
        Context.SaveChanges();

        return gamePlayed;
    }

    public List<EntityPlayed> DeleteEntitiesNotTouched(long gamePlayedId, long entityGroupId)
    {
        var gamePlayed = Context.GamePlayed
            .Include(g => g.EntitiesPlayed
                .Where(e => e.Entity.Group.CanRemoveNotUsed == true
                            && e.Owner == null 
                            && e.Entity.GroupId == entityGroupId)
            ).FindOrThrow(gamePlayedId);

        if (gamePlayed.IsFinished)
        {
            throw new UnauthorizedException("La partie est terminée");
        }
        
        foreach (var entity in gamePlayed.EntitiesPlayed)
        {
            entity.Deleted = true;
            Context.Update(entity);
        }

        Context.SaveChanges();
        
        return gamePlayed.EntitiesPlayed.ToList();
    }

    public List<EntityPlayed> RandomizeEntities(long gamePlayedId, long entityGroupId, bool restoreDeleted, bool onlyTouched)
    {
        var entityGroup = Context.EntitiesGroups.FindOrThrow(entityGroupId);
        
        var gamePlayed = Context.GamePlayed.Include(g => g.Players).FindOrThrow(gamePlayedId);

        if (gamePlayed.IsFinished)
        {
            throw new UnauthorizedException("La partie est terminée");
        }

        var entitiesPlayed = Context.EntityPlayed
            .Include(e => e.EntitiesLinked)
            .ThenInclude(e => e.Entity)
            .Where(e => 
                e.Entity.Group.Randomize
                && e.Entity.GroupId == entityGroupId
                && (restoreDeleted || e.Deleted == false)
                && (!onlyTouched || e.Owner != null)
            ).ToList();
        
        foreach (var entityPlayed in entitiesPlayed)
        {
            entityPlayed.X = entityPlayed.Entity.X;
            entityPlayed.Y = entityPlayed.Entity.Y;
            entityPlayed.Order = entityPlayed.Entity.Order;
            entityPlayed.Rotation = entityPlayed.Entity.Rotation;
            entityPlayed.ShowBack = entityPlayed.Entity.ShowBack;
            entityPlayed.CanFlip = entityPlayed.Entity.CanFlip;
            entityPlayed.OnlyForOwner = entityPlayed.Entity.OnlyForOwner;
            entityPlayed.Deleted = false;
            entityPlayed.Container = null;
            entityPlayed.OwnerId = null;
            entityPlayed.LastActorTouchedId = null;

            foreach (var entityLinked in entityPlayed.EntitiesLinked)
            {
                entityLinked.X = entityLinked.Entity.X;
                entityLinked.Y = entityLinked.Entity.Y;
                entityLinked.Order = entityLinked.Entity.Order;
                entityLinked.Rotation = entityLinked.Entity.Rotation;
                entityLinked.ShowBack = entityLinked.Entity.ShowBack;
                entityLinked.CanFlip = entityLinked.Entity.CanFlip;
                entityLinked.OnlyForOwner = entityLinked.Entity.OnlyForOwner;
                entityLinked.Deleted = false;
                entityLinked.Container = null;
                entityLinked.OwnerId = null;
                entityLinked.LastActorTouchedId = null;
            }
            
            Context.Update(entityPlayed);
        }

        entitiesPlayed = RandomizeEntities(entitiesPlayed, entityGroup, gamePlayed);
        
        Context.SaveChanges();
        
        return entitiesPlayed;
    }

    public EntityPlayed MoveEntity(long entityPlayedId, long playerId, int x, int y, string? container)
    {
        var entityPlayed = Context.EntityPlayed.WithNavigationsIncluded().FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(playerId);
     
        if (!CanMove(entityPlayed, player))
        {
            throw new ForbiddenGameActionException("Déplacer");
        }

        var deltaX = x - entityPlayed.X;
        var deltaY = y - entityPlayed.Y;

        entityPlayed.X = x;
        entityPlayed.Y = y;
        entityPlayed.Container = container;
        entityPlayed.LastActorTouched = player;

        Context.Update(entityPlayed);

        foreach (var entityLinked in entityPlayed.EntitiesLinked.Where(e => e.Entity is { MoveWithLink: true, CanMove: true }))
        {
            entityLinked.X += deltaX;
            entityLinked.Y += deltaY;
            entityLinked.Container = container;
            entityLinked.LastActorTouched = player;
            Context.Update(entityLinked);    
        }
        
        Context.SaveChanges();

        return entityPlayed;
    }

    public EntityPlayed FlipEntity(long entityPlayedId, long playerId, bool showBack, bool? onlyForOwner = null)
    {
        var entityPlayed = Context.EntityPlayed.WithNavigationsIncluded().FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(playerId);

        if (CanFlip(entityPlayed, player) == EntityFlippableState.NotFlippable)
        {
            throw new ForbiddenGameActionException("Retourner");
        }

        if (entityPlayed.Owner == null && entityPlayed.OnlyForOwner == true && showBack && entityPlayed.Container == null)
        {
            entityPlayed.Container = $"player-{playerId}";
        }

        if (entityPlayed.Entity.AllowFlipOnce)
        {
            entityPlayed.CanFlip = false;
        }
        
        if (onlyForOwner == false)
        {
            entityPlayed.OnlyForOwner = false;
        }

        entityPlayed.ShowBack = showBack;
        entityPlayed.Owner ??= player;
        entityPlayed.LastActorTouched = player;
        
        Context.Update(entityPlayed);
        
        foreach (var entityLinked in entityPlayed.EntitiesLinked.Where(e => e.Entity.CanFlip))
        {
            entityLinked.ShowBack = showBack;
            entityLinked.Owner ??= player;
            entityLinked.LastActorTouched = player;
            Context.Update(entityLinked);    
        }
        
        Context.SaveChanges();

        return entityPlayed;
    }

    public EntityPlayed RotateEntity(long entityPlayedId, long playerId, int rotation)
    {
        var entityPlayed = Context.EntityPlayed.WithNavigationsIncluded().FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(playerId);
        
        if (!CanRotate(entityPlayed, player))
        {
            throw new ForbiddenGameActionException("Tourner");
        }

        var delta = rotation - entityPlayed.Rotation;
        
        entityPlayed.Rotation = rotation;
        entityPlayed.LastActorTouched = player;
        
        Context.Update(entityPlayed);
        
        foreach (var entityLinked in entityPlayed.EntitiesLinked.Where(e => e.Entity is { MoveWithLink: true, CanRotate: true }))
        {
            entityLinked.Rotation += delta;
            entityLinked.LastActorTouched = player;
            Context.Update(entityLinked);    
        }
        
        Context.SaveChanges();

        return entityPlayed;
    }
    
    public EntityPlayed DeleteEntity(long entityPlayedId, long playerId)
    {
        var entityPlayed = Context.EntityPlayed.WithNavigationsIncluded().FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(playerId);
        
        if (!CanBeDeleted(entityPlayed, player))
        {
            throw new ForbiddenGameActionException("Défausser");
        }

        entityPlayed.Deleted = true;
        entityPlayed.Owner = null;
        entityPlayed.LastActorTouched = player;
        
        Context.Update(entityPlayed);

        foreach (var entityLinked in entityPlayed.EntitiesLinked.Where(e => e.Entity is { DeleteWithLink: true, CanBeDeleted: true }))
        {
            entityLinked.Deleted = true;
            entityLinked.Owner = null;
            entityLinked.LastActorTouched = player;
            Context.Update(entityLinked);    
        }
        
        Context.SaveChanges();

        return entityPlayed;
    }
    
    public EntityPlayed GiveEntity(long entityPlayedId, long playerId, long newPlayerId, string? container)
    {
        var entityPlayed = Context.EntityPlayed.WithNavigationsIncluded().FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(playerId);
        var newPlayer = Context.Players.FindOrThrow(newPlayerId);
        
        if (!CanBeGiven(entityPlayed, player))
        {
            throw new ForbiddenGameActionException("Donner");
        }

        entityPlayed.Owner = newPlayer;
        entityPlayed.LastActorTouched = player;
        entityPlayed.Container = container;
        
        Context.Update(entityPlayed);

        foreach (var entityLinked in entityPlayed.EntitiesLinked)
        {
            entityLinked.Owner = newPlayer;
            entityLinked.LastActorTouched = player;
            entityLinked.Container = container;
            Context.Update(entityLinked);    
        }
        
        Context.SaveChanges();

        return entityPlayed;
    }

    public bool CanMove(EntityPlayed entityPlayed, Player player)
    {
        return IsOwner(entityPlayed, player) && !entityPlayed.GamePlayed.IsFinished && entityPlayed.Entity.CanMove;
    }

    public bool CanBeDeleted(EntityPlayed entityPlayed, Player player)
    {
        return IsOwner(entityPlayed, player) && !entityPlayed.GamePlayed.IsFinished && entityPlayed.Entity.CanBeDeleted;
    }

    public bool CanRotate(EntityPlayed entityPlayed, Player player)
    {
        return IsOwner(entityPlayed, player) && !entityPlayed.GamePlayed.IsFinished && entityPlayed.Entity.CanRotate;
    }

    public EntityFlippableState CanFlip(EntityPlayed entityPlayed, Player player)
    {
        if (!IsOwner(entityPlayed, player) || entityPlayed.GamePlayed.IsFinished)
        {
            return EntityFlippableState.NotFlippable;
        }

        if (!entityPlayed.CanFlip)
        {
            return EntityFlippableState.NotFlippable;
        }
            
        if (entityPlayed.OnlyForOwner)
        {
            if(IsMine(entityPlayed, player))
            {
                return entityPlayed.ShowBack ? EntityFlippableState.OnlyForOwnerIsMineShowBack : EntityFlippableState.OnlyForOwnerIsMineNotShowBack;
            }

            if(entityPlayed is { ShowBack: true, Owner: null })
            {
                return EntityFlippableState.OnlyForOwnerShowBack;
            }
        }
        else
        {
            return entityPlayed.ShowBack ? EntityFlippableState.ShowBack : EntityFlippableState.NotShowBack;
        }

        return EntityFlippableState.NotFlippable;
    }

    public bool CanBeGiven(EntityPlayed entityPlayed, Player player)
    {
        return IsOwner(entityPlayed, player) && !entityPlayed.GamePlayed.IsFinished && entityPlayed.OnlyForOwner;
    }

    public bool IsOwner(EntityPlayed entityPlayed, Player player)
    {
        // Si pas de proprio OR qu'elle est pour tout le monde
        if (entityPlayed.Owner == null || !entityPlayed.OnlyForOwner)
        {
            return true;
        }
        
        // Seulement pour le proprio et c'est le prorio 
        return entityPlayed.OnlyForOwner && IsMine(entityPlayed, player);
    }

    public bool IsMine(EntityPlayed entityPlayed, Player player)
    {
        return player == entityPlayed.Owner;
    }

    private List<EntityPlayed> RandomizeEntities(List<EntityPlayed> entitiesPlayed, EntityGroup entityGroup, GamePlayed gamePlayed)
    {
        var players = gamePlayed.Players;

        if (entityGroup.Randomize)
        {
            Queue<Player> playersToGive = [];

            if (entityGroup.NumberToGiveToPlayer > 0)
            {
                foreach (var player in players)
                {
                    for (var i = 0; i < entityGroup.NumberToGiveToPlayer; i++)
                    {
                        playersToGive.Enqueue(player);
                    }
                }
            }
            
            return entitiesPlayed
                .OrderBy(_ => Random.Shared.Next())
                .Select((e, i) =>
                {
                    var entityInGroup = entityGroup.Entities.ElementAt(i);
                    
                    e.X = entityInGroup.X;
                    e.Y = entityInGroup.Y;
                    
                    if (playersToGive.Count > 0)
                    {
                        var player = playersToGive.Dequeue();
                        var newX = (e.Entity.Width + 5) * entitiesPlayed.Count(ee => ee.OwnerId == player.Id);

                        e.X += newX;
                        e.OwnerId = player.Id;

                        if (!e.IsInMainContainer())
                        {
                            e.Container = $"player-{player.Id}";
                        }
                        
                        foreach (var eLinked in e.EntitiesLinked)
                        {
                            if (eLinked.Entity.MoveWithLink)
                            {
                                eLinked.X += newX;
                            }

                            eLinked.OwnerId = e.OwnerId;

                            if (!eLinked.IsInMainContainer())
                            {
                                eLinked.Container = e.Container;
                            }
                        }
                    }
                    else if (entityGroup.CanRemoveNotUsed)
                    {
                        e.Deleted = true;
                        
                        foreach (var eLinked in e.EntitiesLinked)
                        {
                            if (eLinked.Entity.DeleteWithLink)
                            {
                                eLinked.Deleted = true;
                            }
                        }
                    }

                    return e;
                }).ToList();
        }

        return entitiesPlayed;
    }
}

public enum EntityFlippableState
{
    OnlyForOwnerIsMineShowBack,
    OnlyForOwnerIsMineNotShowBack,
    OnlyForOwnerShowBack,
    ShowBack,
    NotShowBack,
    NotFlippable
}