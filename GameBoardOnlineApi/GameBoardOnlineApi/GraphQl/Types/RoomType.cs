using Common.Context;

namespace GameBoardOnlineApi.GraphQl.Types;

public class RoomType : ObjectType<Room>
{
    protected override void Configure(IObjectTypeDescriptor<Room> descriptor)
    {
        base.Configure(descriptor);

        descriptor
            .Field(w => w.CurrentGame)
            .Type<GameSimpleType>();

        descriptor
            .Field(w => w.ChatMessages)
            .UseSorting();
    }
}