using Common.Context;

namespace Common.Models;

public record EventRoomAction
{
    public required Room Room { get; init; }
    
    public required RoomAction Action { get; init; }
    
    public User? User { get; init; }
    
    public GamePlayed? GamePlayed { get; init; }
}

public enum RoomAction
{
    Join,
    Leave,
    NewGame,
    Change
}