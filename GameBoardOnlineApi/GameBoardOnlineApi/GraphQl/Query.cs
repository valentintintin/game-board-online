using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Services;
using GameBoardOnlineApi.GraphQl.Games.CodeNames;
using HotChocolate.Authorization;

namespace GameBoardOnlineApi.GraphQl;

public class Query
{
    public string Login(string name, [Service] UserService userService)
    {
        return userService.Login(userService.Create(name));
    }

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public User Me(DataContext context, ClaimsPrincipal principal)
    {
        return context.Users.FindOrThrow(principal.GetUserId());
    }

    [Authorize]
    [UseProjection]
    public IQueryable<Room> GetRooms(DataContext context)
    {
        return context.Rooms;
    }

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Room> GetRoom(Guid roomId, DataContext context)
    {
        return context.Rooms.FindByIdAsQueryable(roomId);
    }

    public CodeNamesQuery CodeNames => new();
}