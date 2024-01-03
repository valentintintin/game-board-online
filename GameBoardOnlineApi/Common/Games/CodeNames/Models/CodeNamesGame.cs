using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesGame : Game
{
    public virtual ICollection<CodeNamesWordCard> Words { get; set; } = [];
    
    public virtual ICollection<CodeNamesHint> Hints { get; set; } = [];
    
    public CodeNamesTeam? CurrentTeam { get; set; }
    public CodeNamesTeam? WinnerTeam { get; set; }

    public CodeNamesTeam TeamBeginning { get; set; }

    public CodeNamesGame()
    {
    }

    [SetsRequiredMembers]
    public CodeNamesGame(Room room, CodeNamesTeam teamBeginning)
    {
        Name = "CodeNames";
        Room = room;
        TeamBeginning = teamBeginning;
        CurrentTeam = teamBeginning;
        SetState(CodeNamesState.Hint);
    }

    public IEnumerable<CodeNamesPlayer> GetPlayers()
    {
        return GetPlayers<CodeNamesPlayer>();
    }

    public CodeNamesState? GetCurrentState()
    {
        return GetCurrentState<CodeNamesState>();
    }
}