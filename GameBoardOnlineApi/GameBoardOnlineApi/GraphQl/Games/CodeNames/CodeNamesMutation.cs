using System.Security.Claims;
using Common.Context;
using Common.Extensions;
using Common.Games.CodeNames;
using Common.Games.CodeNames.Events;
using Common.Games.CodeNames.Models;
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
    public IQueryable<CodeNamesGame> GiveHint(Guid roomId, CodeNamesGiveHintEvent data, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        
        return context.Games.FindByIdAsQueryable(codeNamesService.DoAction(room, user, CodeNamesAction.GiveHint, data.ToDictionary()).Id).Cast<CodeNamesGame>();
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<CodeNamesGame> MakeProposal(Guid roomId, CodeNamesMakeProposalEvent data, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        
        return context.Games.FindByIdAsQueryable(codeNamesService.DoAction(room, user, CodeNamesAction.MakeProposal, data.ToDictionary()).Id).Cast<CodeNamesGame>();
    }
    
    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<CodeNamesGame> Reset(Guid roomId, DataContext context, ClaimsPrincipal claimsPrincipal, [Service] CodeNamesService codeNamesService)
    {
        var room = context.Rooms.FindOrThrow(roomId);
        var user = context.Users.FindOrThrow(claimsPrincipal.GetUserId());
        
        return context.Games.FindByIdAsQueryable(codeNamesService.DoAction(room, user, CodeNamesAction.Reset, null).Id).Cast<CodeNamesGame>();
    }
}