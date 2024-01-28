using System.Security.Claims;
using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Models;
using Common.Services;
using GameBoardOnlineApi.Dto;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace GameBoardOnlineApi.GraphQl;

public class Mutation
{
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<User> Login(string name, string color, DataContext context, [Service] UserService userService)
    {
        return context.Users.FindByIdAsQueryable(userService.Create(name, color).Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<Room>> CreateRoom(string name, DataContext context, ClaimsPrincipal claimsPrincipal, 
        [Service] RoomService roomService, [Service] ITopicEventSender sender)
    {
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        var room = roomService.Create(user.Id, name);

        await sender.SendAsync(nameof(Subscription.NewRoom), room);

        return context.Rooms.FindByIdAsQueryable(room.Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<Room>> JoinRoom(long roomId, DataContext context, ClaimsPrincipal claimsPrincipal, 
        [Service] RoomService roomService, [Service] ITopicEventSender sender)
    {
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        var room = roomService.Join(roomId, user.Id);
        
        await sender.SendAsync(nameof(Subscription.RoomAction), new EventRoomAction
        {
            Action = RoomAction.Join,
            Room = room,
            User = user
        });
        
        return context.Rooms.FindByIdAsQueryable(room.Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<Room>> LeaveRoom(long roomId, long userId, DataContext context, ClaimsPrincipal claimsPrincipal, 
        [Service] RoomService roomService, [Service] ITopicEventSender sender, [Service] SecurityService securityService)
    {
        var userConnectedId = claimsPrincipal.GetUserId();

        if (!securityService.IsRoomAllowed(roomId, userConnectedId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le salon");
        }
        
        if (!securityService.IsRoomAllowed(roomId, userId))
        {
            throw new UnauthorizedException("L'utilisateur n'est pas dans le salon");
        }
        
        if (context.Rooms.FindOrThrow(roomId).OwnerId == userId)
        {
            throw new UnauthorizedException("L'utilisateur ne peut être exclu de son propre salon");
        }
        
        await sender.SendAsync(nameof(Subscription.RoomAction), new EventRoomAction
        {
            Action = RoomAction.Leave,
            Room = roomService.Leave(roomId, userId),
            User = context.Users.FindOrThrow(userId)
        });
        
        return context.Rooms.FindByIdAsQueryable(roomId);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<GamePlayed>> InitializeGame(long roomId, long gameId, DataContext context, 
        [Service] GameService gameService, ClaimsPrincipal claimsPrincipal, [Service] SecurityService securityService,
        [Service] ITopicEventSender sender)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsRoomAllowed(roomId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le salon");
        }
        
        var gamePlayed = gameService.InitializeGame(roomId, gameId);
        
        await sender.SendAsync(nameof(Subscription.RoomAction), new EventRoomAction
        {
            Action = RoomAction.NewGame,
            Room = context.Rooms.FindOrThrow(roomId),
            User = context.Users.FindOrThrow(userId)
        });

        return context.GamePlayed.FindByIdAsQueryable(gamePlayed.Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<Room>> SetCurrentGame(long roomId, long gamePlayedId, DataContext context, 
        [Service] RoomService roomService, [Service] SecurityService securityService, ClaimsPrincipal claimsPrincipal,
        [Service] ITopicEventSender sender)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsRoomAllowed(roomId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le salon");
        }
        
        await sender.SendAsync(nameof(Subscription.RoomAction), new EventRoomAction
        {
            Action = RoomAction.NewGame,
            Room = roomService.SetCurrentGame(roomId, gamePlayedId),
            User = context.Users.FindOrThrow(userId)
        });
        
        return context.Rooms.FindByIdAsQueryable(roomId);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<ChatMessage>> SendChatMessage(long roomId, string message, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] RoomService roomService, [Service] ITopicEventSender sender, 
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsRoomAllowed(roomId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le salon");
        }
        
        var chatMessage = roomService.SendChatMessage(roomId, message, claimsPrincipal.GetUserId());

        await sender.SendAsync(nameof(Subscription.ChatMessage), chatMessage);

        return context.ChatMessages.FindByIdAsQueryable(chatMessage.Id);
    }
    
    [Authorize]
    public async Task<List<EntityPlayed>> DeleteEntitiesNotTouched(long gamePlayedId, ClaimsPrincipal claimsPrincipal,
        [Service] GameService gameService, [Service] ITopicEventSender sender, DataContext context,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsGamePlayedAllowed(gamePlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }
        
        var player = context.GamePlayed.FindOrThrow(gamePlayedId).Players.First(p => p.User.Id == claimsPrincipal.GetUserId());
        var entitiesPlayed = gameService.DeleteEntitiesNotTouched(gamePlayedId);

        foreach (var entityPlayed in entitiesPlayed)
        {
            await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
            {
                Action = GameAction.Delete,
                Player = player,
                Entity = entityPlayed
            });
        }

        return entitiesPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public async Task<EntityPlayed> GameMoveEntity(long entityPlayedId, int x, int y, string? container, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] GameService gameService, [Service] ITopicEventSender sender,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsEntityPlayedAllowed(entityPlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }
        
        var entityPlayed = context.EntityPlayed.FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.First(p => p.User.Id == claimsPrincipal.GetUserId());

        entityPlayed = gameService.MoveEntity(entityPlayedId, player.Id, x, y, container);

        await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
        {
            Action = GameAction.Move,
            Player = player,
            Entity = entityPlayed
        });

        return entityPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public async Task<EntityPlayed> GameRotateEntity(long entityPlayedId, int rotation, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] GameService gameService, [Service] ITopicEventSender sender,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsEntityPlayedAllowed(entityPlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }

        var entityPlayed = context.EntityPlayed.FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.First(p => p.User.Id == claimsPrincipal.GetUserId());

        entityPlayed = gameService.RotateEntity(entityPlayedId, player.Id, rotation);

        await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
        {
            Action = GameAction.Rotate,
            Player = player,
            Entity = entityPlayed
        });

        return entityPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public async Task<EntityPlayed> GameFlipEntity(long entityPlayedId, bool showBack, bool? onlyForOwner,
        DataContext context, ClaimsPrincipal claimsPrincipal, 
        [Service] GameService gameService, [Service] ITopicEventSender sender,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsEntityPlayedAllowed(entityPlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }

        var entityPlayed = context.EntityPlayed.FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.First(p => p.User.Id == claimsPrincipal.GetUserId());

        entityPlayed = gameService.FlipEntity(entityPlayedId, player.Id, showBack, onlyForOwner);

        await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
        {
            Action = GameAction.Flip,
            Player = player,
            Entity = entityPlayed
        });

        return entityPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public async Task<EntityPlayed> GameDeleteEntity(long entityPlayedId, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] GameService gameService, [Service] ITopicEventSender sender,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsEntityPlayedAllowed(entityPlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }

        var entityPlayed = context.EntityPlayed.FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.First(p => p.User.Id == claimsPrincipal.GetUserId());

        entityPlayed = gameService.DeleteEntity(entityPlayedId, player.Id);

        await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
        {
            Action = GameAction.Delete,
            Player = player,
            Entity = entityPlayed
        });

        return entityPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public async Task<EntityPlayed> GameGiveEntity(long entityPlayedId, long newPlayerId, string? container, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] GameService gameService, [Service] ITopicEventSender sender,
        [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (!securityService.IsEntityPlayedAllowed(entityPlayedId, userId))
        {
            throw new UnauthorizedException("Vous n'êtes pas dans le jeu");
        }

        var entityPlayed = context.EntityPlayed.FindOrThrow(entityPlayedId);
        var player = entityPlayed.GamePlayed.Players.First(p => p.User.Id == claimsPrincipal.GetUserId());
        var newPlayer = entityPlayed.GamePlayed.Players.AsQueryable().FindOrThrow(newPlayerId);

        entityPlayed = gameService.GiveEntity(entityPlayedId, player.Id, newPlayer.Id, container);

        await sender.SendAsync(nameof(Subscription.GameAction), new EventGameAction
        {
            Action = GameAction.Give,
            Player = player,
            Entity = entityPlayed
        });

        return entityPlayed;
    }
    
    [Authorize]
    [UseProjection]
    public IQueryable<Entity> UpdateEntity(long entityId, EntityUpdateDto dto, DataContext context)
    {
        var entity = context.Entities.FindOrThrow(entityId);

        entity.X = dto.X;
        entity.Y = dto.Y;
        entity.Rotation = dto.Rotation;
        entity.ShowBack = dto.ShowBack;
        
        context.Update(entity);
        context.SaveChanges();
        
        return context.Entities.FindByIdAsQueryable(entityId);
    }
    
    // [Authorize]
    // [UseProjection]
    // public IQueryable<EntityGroup> UpdateGroupEntity(long entityGroupId, EntityGroupUpdateDto dto, DataContext context)
    // {
    //     var entityGroup = context.EntitiesGroups.FindOrThrow(entityGroupId);
    //
    //     context.Update(entityGroup);
    //     context.SaveChanges();
    //     
    //     return context.EntitiesGroups.FindByIdAsQueryable(entityGroupId);
    // }
}