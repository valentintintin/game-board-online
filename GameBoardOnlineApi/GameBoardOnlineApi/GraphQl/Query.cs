using System.Security.Claims;
using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Common.Services;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl;

public class Query
{
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
    public IQueryable<Room> GetRoom(long roomId, DataContext context)
    {
        return context.Rooms.FindByIdAsQueryable(roomId);
    }

    [Authorize]
    [UseProjection]
    public IQueryable<Game> Games(DataContext context)
    {
        return context.Games;
    }

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Game> Game(long gameId, DataContext context)
    {
        return context.Games.FindByIdAsQueryable(gameId);
    }

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<GamePlayed> GamePlayed(long gamePlayedId, DataContext context)
    {
        return context.GamePlayed.FindByIdAsQueryable(gamePlayedId);
    }
}