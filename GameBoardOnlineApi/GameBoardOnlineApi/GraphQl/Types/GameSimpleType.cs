using Common.Context;

namespace GameBoardOnlineApi.GraphQl.Types;

public class GameSimpleType : ObjectType<Game>
{
    protected override void Configure(IObjectTypeDescriptor<Game> descriptor)
    {
        base.Configure(descriptor);

        descriptor.BindFieldsExplicitly();
        
        descriptor.Field(w => w.Id);
        descriptor.Field(w => w.Name);
        descriptor.Field(w => w.Type);
        descriptor.Field(w => w.CreatedAt);
        descriptor.Field(w => w.Players);
    }
}