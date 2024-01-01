using Common.Context;

namespace Common.Models;

public record EventResponse<TGame, TPlayer, TAction, TEvent> where TGame : Game where TPlayer : Player where TAction : Enum
{
    public required TGame Game { get; init; }
    
    public required TAction Action { get; init; }
    
    public required TPlayer Player { get; init; }
    
    public TEvent? Data { get; set; }
}