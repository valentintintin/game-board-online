using Common.Context;
using Common.Extensions;
using Common.Services;
using GameBoardOnlineApi.Dto;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl.Types;

public class GamePlayedType : ObjectType<GamePlayed>
{
    protected override void Configure(IObjectTypeDescriptor<GamePlayed> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(e => e.GameId).IsProjected();
        
        descriptor.Field(e => e.EntitiesPlayed)
            .Name("entities")
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                return context.DbContext<DataContext>().EntityPlayed
                    .WithNavigationsIncluded()
                    .Where(e => e.GamePlayedId == context.Parent<GamePlayed>().Id)
                    .OrderBy(e => e.Entity.Order)
                    .ThenBy(e => e.Id)
                    .ToList();
            });

        descriptor.Field("entitiesGroups")
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                return context.DbContext<DataContext>().EntitiesGroups
                    .Where(e => e.GameId == context.Parent<GamePlayed>().GameId)
                    .OrderBy(e => e.Name)
                    .ThenBy(e => e.Id)
                    .ToList();
            });
    }
}