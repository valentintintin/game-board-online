using Common.Games.CodeNames.Models;

namespace GameBoardOnlineApi.GraphQl.Games.CodeNames.Types;

public class CodeNamesWordCardType : ObjectType<CodeNamesWordCard>
{
    protected override void Configure(IObjectTypeDescriptor<CodeNamesWordCard> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(w => w.Team).Ignore();
    }
}