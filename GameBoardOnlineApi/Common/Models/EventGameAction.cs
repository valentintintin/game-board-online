using Common.Context;

namespace Common.Models;

public record EventGameAction
{
    public Player? Player { get; init; }
    
    public required EntityPlayed Entity { get; set; }
    
    public required GameAction Action { get; init; }
}

public enum GameAction
{
    Move,
    Delete,
    Flip,
    Rotate,
    Give,
    Randomize
}