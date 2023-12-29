using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesGame : Game
{
    public virtual ICollection<CodeNamesWordCard> Words { get; set; } = [];
    
    public virtual ICollection<CodeNamesHint> Hints { get; set; } = [];

    public CodeNamesTeam TeamBeginning { get; set; }

    public CodeNamesGame()
    {
    }

    [SetsRequiredMembers]
    public CodeNamesGame(CodeNamesTeam teamBeginning)
    {
        Name = "CodeNames";
        TeamBeginning = teamBeginning;
    }

    public IEnumerable<CodeNamesPlayer> GetPlayers()
    {
        return Players.Cast<CodeNamesPlayer>();
    }
}