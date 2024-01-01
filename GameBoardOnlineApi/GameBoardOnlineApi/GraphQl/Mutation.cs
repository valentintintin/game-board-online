using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Services;
using GameBoardOnlineApi.GraphQl.Games.CodeNames;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace GameBoardOnlineApi.GraphQl;

public class Mutation
{
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room> CreateRoom(string name, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] RoomService roomService)
    {
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());

        return context.Rooms.FindByIdAsQueryable(roomService.Create(user, name).Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room> JoinRoom(Guid roomId, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] RoomService roomService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());

        return context.Rooms.FindByIdAsQueryable(roomService.Join(room, user).Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room> LeaveRoom(Guid roomId, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] RoomService roomService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());

        return context.Rooms.FindByIdAsQueryable(roomService.Leave(room, user).Id);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<ChatMessage>> SendChatMessage(Guid roomId, string message, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] RoomService roomService, [Service] ITopicEventSender sender)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());

        var chatMessage = roomService.SendChatMessage(room, user, message);

        await sender.SendAsync(nameof(Subscription.ChatMessage), chatMessage);

        return context.ChatMessages.FindByIdAsQueryable(chatMessage.Id);
    }
    
    public CodeNamesMutations CodeNames => new();
}