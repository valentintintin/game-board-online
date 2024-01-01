using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Games.CodeNames;
using Common.Games.CodeNames.Events;
using Common.Games.CodeNames.Events.Requests;
using Common.Games.CodeNames.Models;
using Common.Models;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace GameBoardOnlineApi.GraphQl.Games.CodeNames;

public class CodeNamesMutations
{
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<CodeNamesGame> Create(Guid roomId, DataContext context, [Service] CodeNamesService codeNamesService)
    {
        var room = context.Rooms.Include(r => r.Users).FindOrThrow(roomId);
        return context.Games.FindByIdAsQueryable(codeNamesService.InitializeGame(room).Id).Cast<CodeNamesGame>();
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesHint> GiveHint(Guid gameId, CodeNamesGiveHintEventRequest data, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var game = (CodeNamesGame) context.Games.FindOrThrow(gameId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());

        return codeNamesService.GiveHint(game, user, data);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesWordCard> MakeProposal(Guid gameId, CodeNamesMakeProposalEventRequest data, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var game = (CodeNamesGame) context.Games.FindOrThrow(gameId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        
        return codeNamesService.MakeProposal(game, user, data);
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object> Reset(Guid roomId, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        
        return codeNamesService.Reset(room, user);
    }
}