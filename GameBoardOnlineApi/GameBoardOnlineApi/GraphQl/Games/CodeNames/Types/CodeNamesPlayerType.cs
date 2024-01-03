using Common.Games.CodeNames.Models;

namespace GameBoardOnlineApi.GraphQl.Games.CodeNames.Types;

public class CodeNamesPlayerType : ObjectType<CodeNamesPlayer>
{
    protected override void Configure(IObjectTypeDescriptor<CodeNamesPlayer> descriptor)
    {
        base.Configure(descriptor);
    }
}