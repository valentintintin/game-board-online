using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesWordCard : Entity
{
    public required string Word { get; set; }
    public required CodeNamesTeam Team { get; set; }
    
    public bool IsFound => ShowBack;

    public CodeNamesWordCard()
    {
    }
    
    [SetsRequiredMembers]
    public CodeNamesWordCard(Game game, string word, CodeNamesTeam team) : base(game, $"Mot {word}", "card.jpg", team switch
    {
        CodeNamesTeam.Red => "red.jpg",
        CodeNamesTeam.Blue => "blue.jpg",
        CodeNamesTeam.Neutral => "neutral.jpg",
        CodeNamesTeam.Black => "black.jpg",
        _ => throw new ArgumentOutOfRangeException(nameof(team), team, null)
    })
    {
        AllowFlipOnce = true;

        Word = word;
        Team = team;
    }

    public void SetFound()
    {
        ShowBack = true;
    }
}