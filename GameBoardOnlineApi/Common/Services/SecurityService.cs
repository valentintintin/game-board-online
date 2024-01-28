using Common.Context;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public class SecurityService : AService
{
    public SecurityService(ILogger<SecurityService> logger, IDbContextFactory<DataContext> dbContextFactory) : base(logger, dbContextFactory)
    {
    }

    public bool IsGamePlayedAllowed(long gamePlayedId, long userId)
    {
        return Context.GamePlayed
            .Include(g => g.Players)
            .FindOrThrow(gamePlayedId)
            .Players
            .Any(p => p.UserId == userId);
    }

    public bool IsRoomAllowed(long roomId, long userId)
    {
        return Context.Rooms
            .Include(r => r.Users)
            .FindOrThrow(roomId)
            .Users
            .Any(p => p.Id == userId);
    }

    public bool IsEntityPlayedAllowed(long entityPlayedId, long userId)
    {
        return Context.EntityPlayed
            .Include(e => e.GamePlayed)
            .ThenInclude(r => r.Players)
            .FindOrThrow(entityPlayedId)
            .GamePlayed.Players
            .Any(p => p.UserId == userId);
    }
}