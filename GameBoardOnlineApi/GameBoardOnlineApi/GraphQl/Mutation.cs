using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Services;
using GameBoardOnlineApi.GraphQl.Games.CodeNames;
using HotChocolate.Authorization;

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
    
    public CodeNamesMutations CodeNames => new();
}