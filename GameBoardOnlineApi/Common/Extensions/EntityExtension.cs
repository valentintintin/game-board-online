using Common.Exceptions;
using Common.Models;
using Common.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Common.Extensions;

public static class EntityExtension
{
    public static IQueryable<TEntity> FindByIdAsQueryable<TEntity>(this IQueryable<TEntity> entities, Guid? id) where TEntity : IEntity
    {
        return entities.Where(e => e.Id == id);
    }

    public static TEntity? Find<TEntity>(this IQueryable<TEntity> entities, Guid? id) where TEntity : IEntity
    {
        if (!id.HasValue)
        {
            return default;
        }

        return entities.FirstOrDefault(e => e.Id == id);
    }

    public static TEntity FindOrThrow<TEntity>(this IQueryable<TEntity> entities, Guid? id) where TEntity : IEntity
    {
        if (!id.HasValue)
        {
            throw new NotFoundException<TEntity>(id);
        }

        var entity = entities.FirstOrDefault(e => e.Id == id);

        if (entity == null)
        {
            throw new NotFoundException<TEntity>(id);
        }

        return entity;
    }

    public static async Task<TEntity> FindOrThrowAsync<TEntity>(this IQueryable<TEntity> entities, Guid? id) where TEntity : IEntity
    {
        var entity = await FindAsync(entities, id); 

        if (entity == null)
        {
            throw new NotFoundException<TEntity>(id);
        }

        return entity;
    }

    public static async Task<TEntity?> FindAsync<TEntity>(this IQueryable<TEntity> entities, Guid? id) where TEntity : IEntity
    {
        if (!id.HasValue)
        {
            return default;
        }

        return await entities.FirstOrDefaultAsync(e => e.Id == id);
    }

    public static IQueryable<TEntity> FindMultiples<TEntity>(this IQueryable<TEntity> entities, IList<Guid> ids) where TEntity : IEntity
    {
        return entities.Where(e => ids.Contains(e.Id));
    }
}