using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Models;
using Common.Services;

namespace GameBoardOnlineApi.GraphQl;

// TODO Security
public class Subscription
{
    [Subscribe]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<ChatMessage>? ChatMessage([EventMessage] ChatMessage chatMessage, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (securityService.IsRoomAllowed(chatMessage.RoomId, userId))
        {
            return context.ChatMessages.FindByIdAsQueryable(chatMessage.Id);
        }

        return null;
    }
    
    [Subscribe]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room> NewRoom([EventMessage] Room room, DataContext context)
    {
        return context.Rooms.FindByIdAsQueryable(room.Id);
    }
    
    [Subscribe]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room>? RoomAction([EventMessage] EventRoomAction roomAction, [Service] SecurityService securityService, 
        ClaimsPrincipal claimsPrincipal, DataContext context)
    {
        var userId = claimsPrincipal.GetUserId();

        if (securityService.IsRoomAllowed(roomAction.Room.Id, userId))
        {
            return context.Rooms.FindByIdAsQueryable(roomAction.Room.Id);
        }
        
        return null;
    }
    
    [Subscribe]
    [UseFirstOrDefault]
    public IQueryable<EntityPlayed>? GameAction([EventMessage] EventGameAction gameAction, DataContext context, 
        ClaimsPrincipal claimsPrincipal, [Service] SecurityService securityService)
    {
        var userId = claimsPrincipal.GetUserId();

        if (securityService.IsEntityPlayedAllowed(gameAction.Entity.Id, userId))
        {
            return context.EntityPlayed.WithNavigationsIncluded().FindByIdAsQueryable(gameAction.Entity.Id);
        }
        
        return null;
    }
}