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
                OnlyForOwner = entity.OnlyForOwner,
            }));

            if (entitiesPlayed.Count == 0)
            {
                throw new GameBoardOnlineException($"Erreur, aucune entité pour {entityGroup.Name} #{entityGroup.Id}");
            }

            entitiesPlayed = RandomizeEntities(entitiesPlayed, entityGroup);
            
            foreach (var entityPlayed in entitiesPlayed)
            {
                gamePlayed.Entities.Add(entityPlayed);
            }
        }

        room.CurrentGame = gamePlayed;
        
        Context.Add(gamePlayed);
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
            .Include(g => g.Entities
                .Where(e => e.Entity.Group.CanRemoveNotUsed == true
                            && e.Owner == null 
                            && e.Entity.GroupId == entityGroupId)
            ).FindOrThrow(gamePlayedId);

        if (gamePlayed.IsFinished)
        {
            throw new UnauthorizedException("La partie est terminée");
        }
        
        foreach (var entity in gamePlayed.Entities)
        {
            entity.Deleted = true;
            Context.Update(entity);
        }

        Context.SaveChanges();
        
        return gamePlayed.Entities.ToList();
    }

    public List<EntityPlayed> RandomizeEntities(long gamePlayedId, long entityGroupId, bool restoreDeleted, bool onlyTouched)
    {
        var entityGroup = Context.EntitiesGroups.FindOrThrow(entityGroupId);
        
        var gamePlayed = Context.GamePlayed
            .Include(g => g.Players)
            .Include(g => g.Entities
                .Where(e => 
                    e.Entity.Group.Randomize.HasValue 
                    && e.Entity.GroupId == entityGroupId
                    && (restoreDeleted || e.Deleted == false)
                    && (!onlyTouched || e.Owner != null)
                )
            ).FindOrThrow(gamePlayedId);

        if (gamePlayed.IsFinished)
        {
            throw new UnauthorizedException("La partie est terminée");
        }

        var entitiesPlayed = gamePlayed.Entities.ToList();
        
        foreach (var entity in entitiesPlayed)
        {
            entity.X = entity.Entity.X;
            entity.Y = entity.Entity.Y;
            entity.Order = entity.Entity.Order;
            entity.Rotation = entity.Entity.Rotation;
            entity.ShowBack = entity.Entity.ShowBack;
            entity.CanFlip = entity.Entity.CanFlip;
            entity.OnlyForOwner = entity.Entity.OnlyForOwner;
            entity.Deleted = false;
            entity.Container = null;
            entity.OwnerId = null;
            entity.LastActorTouchedId = null;
        }

        entitiesPlayed = RandomizeEntities(entitiesPlayed, entityGroup);
        
        foreach (var entityPlayed in entitiesPlayed)
        {
            Context.Update(entityPlayed);
        }
        
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

        entityPlayed.X = x;
        entityPlayed.Y = y;
        entityPlayed.Container = container;
        entityPlayed.LastActorTouched = player;

        Context.Update(entityPlayed);
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
        
        entityPlayed.Rotation = rotation;
        entityPlayed.Owner ??= player;
        entityPlayed.LastActorTouched = player;
        
        Context.Update(entityPlayed);
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

    private List<EntityPlayed> RandomizeEntities(List<EntityPlayed> entitiesPlayed, EntityGroup entityGroup)
    {
        var players = entitiesPlayed.First().GamePlayed.Players;
        
        switch (entityGroup.Randomize)
        {
            case RandomizeType.Simple:
                entitiesPlayed = entitiesPlayed
                    .OrderBy(_ => Random.Shared.Next())
                    .Select((e, i) =>
                    {
                        e.Order = e.Entity.Order + i;
                        return e;
                    })
                    .ToList();
                break;
            case RandomizeType.InPlace:
                entitiesPlayed = entitiesPlayed
                    .OrderBy(_ => Random.Shared.Next())
                    .Select((e, i) =>
                    {
                        var entityInGroup = entityGroup.Entities.ElementAt(i);
                            
                        e.X = entityInGroup.X;
                        e.Y = entityInGroup.Y;

                        return e;
                    })
                    .ToList();
                break;
            case RandomizeType.SimpleForPlayers:
                entitiesPlayed = entitiesPlayed
                    .OrderBy(_ => Random.Shared.Next())
                    .Select((e, i) =>
                    {
                        if (i < players.Count)
                        {
                            var playerId = players.ElementAt(i).Id;

                            e.Order = e.Entity.Order + i + 1;
                            e.Container = $"player-{playerId}";
                            e.OwnerId = playerId;
                        }

                        return e;
                    })
                    .ToList();
                break;
            case RandomizeType.InPlaceForPlayers:
                entitiesPlayed = entitiesPlayed
                    .Take(players.Count)
                    .OrderBy(_ => Random.Shared.Next())
                    .Select((e, i) =>
                    {
                        var entityInGroup = entityGroup.Entities.ElementAt(i);
                            
                        e.X = entityInGroup.X;
                        e.Y = entityInGroup.Y;
                        
                        if (i < players.Count)
                        {
                            var playerId = players.ElementAt(i).Id;

                            e.Container = $"player-{playerId}";
                            e.OwnerId = playerId;
                        }

                        return e;
                    })
                    .ToList();
                break;
            case null:
                break;
            default:
                throw new ArgumentOutOfRangeException();
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