using Common.Games.CodeNames.Models;

namespace GameBoardOnlineApi.GraphQl.Games.CodeNames.Types;

public class CodeNamesGameType : ObjectType<CodeNamesGame>
{
    protected override void Configure(IObjectTypeDescriptor<CodeNamesGame> descriptor)
    {
        base.Configure(descriptor);
    }
}