using System.Diagnostics.CodeAnalysis;
using Common.Context;
using Common.Models;

namespace Common.Games.CodeNames.Models;

public record CodeNamesPlayer : Player
{
    public required CodeNamesTeam Team { get; set; }
    public required bool IsGuesser { get; set; }

    public CodeNamesPlayer()
    {
    }
    
    [SetsRequiredMembers]
    public CodeNamesPlayer(Game game, User User, CodeNamesTeam team, bool isGuesser) : base(game, User)
    {
        Team = team;
        IsGuesser = isGuesser;
    }
}