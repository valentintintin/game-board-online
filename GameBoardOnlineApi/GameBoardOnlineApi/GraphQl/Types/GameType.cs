using Common.Context;

namespace GameBoardOnlineApi.GraphQl.Types;

public class GameType : ObjectType<Game>
{
    protected override void Configure(IObjectTypeDescriptor<Game> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(p => p.Type).IsProjected();

        descriptor.Field(p => p.Enabled).Ignore();
        descriptor.Field(p => p.Plays).Ignore();

        descriptor
            .Field(w => w.Image)
            .Resolve(context =>
            {
                var game = context.Parent<Game>();
                var configuration = context.Services.GetRequiredService<IConfiguration>();
                return $"{configuration["ApiUrl"]}{configuration["AssetsPath"]}/{game.Type}/{game.Image}";
            });
    }
}