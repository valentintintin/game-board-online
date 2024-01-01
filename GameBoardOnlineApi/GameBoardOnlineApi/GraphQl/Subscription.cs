using Common.Context;
using Common.Extensions;
using Common.Games.CodeNames.Models;
using Common.Models;

namespace GameBoardOnlineApi.GraphQl;

// TODO Security
public class Subscription
{
    [Subscribe]
    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<ChatMessage> ChatMessage([EventMessage] ChatMessage chatMessage, DataContext context)
    {
        return context.ChatMessages.FindByIdAsQueryable(chatMessage.Id);
    }

    #region CodeNames
    
    [Subscribe]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesHint> GiveHint([EventMessage] EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesHint> data)
    {
        return data;
    }
    
    [Subscribe]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesWordCard> MakeProposal([EventMessage] EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, CodeNamesWordCard> data)
    {
        return data;
    }
    
    [Subscribe]
    public EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object> Reset([EventMessage] EventResponse<CodeNamesGame, CodeNamesPlayer, CodeNamesAction, object> data)
    {
        return data;
    }
    
    #endregion
}