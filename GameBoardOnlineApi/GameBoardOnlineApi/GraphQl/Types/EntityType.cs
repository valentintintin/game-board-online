using Common.Context;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl.Types;

public class EntityType : ObjectType<Entity>
{
    protected override void Configure(IObjectTypeDescriptor<Entity> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(w => w.Id).IsProjected();

        descriptor
            .Field(w => w.Image)
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var entity = context.DbContext<DataContext>().Entities
                    .Include(e => e.Group)
                    .ThenInclude(g => g.Game)
                    .FindOrThrow(context.Parent<Entity>().Id);
                return $"/assets/game-board-collections/{entity.Group.Game.Type}/{entity.Image}";
            });

        descriptor
            .Field(w => w.ImageBack)
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var entity = context.DbContext<DataContext>().Entities
                    .Include(e => e.Group)
                    .ThenInclude(g => g.Game)
                    .FindOrThrow(context.Parent<Entity>().Id);
                return $"/assets/game-board-collections/{entity.Group.Game.Type}/{entity.ImageBack ?? entity.Group.ImageBack}";
            });
    }
}