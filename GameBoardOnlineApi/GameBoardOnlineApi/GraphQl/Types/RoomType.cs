using Common.Context;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl.Types;

public class RoomType : ObjectType<Room>
{
    protected override void Configure(IObjectTypeDescriptor<Room> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(w => w.Id).IsProjected();

        descriptor
            .Field(w => w.ChatMessages)
            .UseSorting();

        descriptor
            .Field("userConnectedIsOwner")
            .Authorize()
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var roomId = context.Parent<Room>().Id;
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var room = context.DbContext<DataContext>().Rooms.FindOrThrow(roomId);

                return room.Owner.Id == userId;
            });

        descriptor
            .Field("userConnectedIsInside")
            .Authorize()
            .UseDbContext<DataContext>()
            .Resolve(context =>
            {
                var roomId = context.Parent<Room>().Id;
                var userId = context.Services.GetRequiredService<IHttpContextAccessor>().HttpContext?.User.GetUserId();

                if (!userId.HasValue)
                {
                    return false;
                }
                
                var room = context.DbContext<DataContext>().Rooms
                    .Include(r => r.Users)
                    .FindOrThrow(roomId);

                return room.Users.Any(u => u.Id == userId);
            });
    }
}