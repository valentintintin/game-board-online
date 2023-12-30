using Common.Context;
using Common.Extensions;
using Common.Games.CodeNames.Models;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl.Games.CodeNames;

public class CodeNamesQuery
{
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<CodeNamesGame> Get(Guid gameId, DataContext context)
    {
        return context.Games.FindByIdAsQueryable(gameId).Cast<CodeNamesGame>();
    }
}