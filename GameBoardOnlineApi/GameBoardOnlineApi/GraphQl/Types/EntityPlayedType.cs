using Common.Context;
using Common.Extensions;
using Common.Services;

namespace GameBoardOnlineApi.GraphQl.Types;

public class EntityPlayedType : ObjectTypeExtension<EntityPlayed>
{
    protected override void Configure(IObjectTypeDescriptor<EntityPlayed> descriptor)
    {
        base.Configure(descriptor);
        
        descriptor
            .Field("image")
            .Resolve(context =>
            {
                var entity = context.Parent<EntityPlayed>();
                var configuration = context.Services.GetRequiredService<IConfiguration>();
                return $"{configuration["ApiUrl"]}{configuration["AssetsPath"]}/{entity.GamePlayed.Game.Type}/{entity.Entity.Image}";
            });

        descriptor
            .Field("imageBack")
            .Resolve(context =>
            {
                var entity = context.Parent<EntityPlayed>();
                var configuration = context.Services.GetRequiredService<IConfiguration>();
                return $"{configuration["ApiUrl"]}{configuration["AssetsPath"]}/{entity.GamePlayed.Game.Type}/{entity.Entity.ImageBack ?? entity.Entity.Group.ImageBack}";
            });
        
        descriptor
            .Field("name")
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var entity = context.Parent<EntityPlayed>();
                return entity.ShowBack ? entity.Entity.Group.Name : entity.Entity.Name;
            });
        
        descriptor
            .Field("width")
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var entity = context.Parent<EntityPlayed>();
                return entity.Entity.Width;
            });
        
        descriptor
            .Field("height")
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var entity = context.Parent<EntityPlayed>();
                return entity.Entity.Height;
            });
        
        descriptor
            .Field("isMine")
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();
                
                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().IsMine(entity, player);
            });
        
        descriptor
            .Field(e => e.CanFlip)
            .Type(typeof(EntityFlippableState))
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();
        
                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();
        
                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().CanFlip(entity, player);
            });
        
        descriptor
            .Field("canMove")
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();

                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().CanMove(entity, player);
            });
        
        descriptor
            .Field("canRotate")
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();

                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().CanRotate(entity, player);
            });
        
        descriptor
            .Field("canBeGiven")
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();

                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().CanBeGiven(entity, player);
            });
        
        descriptor
            .Field("canBeDeleted")
            .Resolve(context =>
            {
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var entity = context.Parent<EntityPlayed>();

                var player = entity.GamePlayed.Players.First(p => p.User.Id == userId);
                
                return context.Services.GetRequiredService<GameService>().CanBeDeleted(entity, player);
            });
    }
}