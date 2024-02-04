using Common.Context;
using Microsoft.EntityFrameworkCore;

namespace Common.Extensions;

public static class EntityPlayedExtensions
{
    // Point of failure ...
    public static IQueryable<EntityPlayed> WithNavigationsIncluded(this IQueryable<EntityPlayed> entities)
    {
        return entities
            .Include(e => e.GamePlayed)
            .ThenInclude(g => g.Players)
            .ThenInclude(p => p.User)
            
            .Include(e => e.GamePlayed)
            .ThenInclude(g => g.Game)
            
            .Include(entityPlayed => entityPlayed.Owner)
            .ThenInclude(o => o!.User)
            
            .Include(entityPlayed => entityPlayed.LastActorTouched)
            
            .Include(entityPlayed => entityPlayed.Entity)
            .ThenInclude(entity => entity.Group)
            
            .Include(entityPlayed => entityPlayed.EntitiesLinked)
            .ThenInclude(entity => entity.Entity);
    }
}