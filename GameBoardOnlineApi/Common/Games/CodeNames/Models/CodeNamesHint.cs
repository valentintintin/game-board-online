using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesHint : VirtualEntity
{
    public required string Word { get; set; }
    public int Nb { get; set; }
    public required HintType Type { get; set; }

    [NotMapped]
    public CodeNamesTeam Team => ((CodeNamesPlayer)Owner!).Team;

    public CodeNamesHint()
    {
    }
    
    [SetsRequiredMembers]
    public CodeNamesHint(Game game, Player player, string word, HintType type, int nb = 0) : base(game, $"Indice {word} {(type == HintType.Infinite ? "illimité" : nb)}")
    {
        Owner = player;
        Word = word;
        Type = type;
        Nb = nb;
    }

    public enum HintType
    {
        Nb,
        Zero,
        Infinite
    }
}