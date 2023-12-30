using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesHint : VirtualEntity
{
    public required string Word { get; set; }
    public int Nb { get; set; }
    public bool IsInfinite { get; set; }

    [NotMapped]
    public CodeNamesTeam Team => ((CodeNamesPlayer)Owner!).Team;

    public CodeNamesHint()
    {
    }
    
    [SetsRequiredMembers]
    public CodeNamesHint(Game game, Player player, string word, int nb, bool isInfinite = false) : base(game, $"Indice {word} {(isInfinite ? "illimité" : nb)}")
    {
        Owner = player;
        Word = word;
        Nb = nb;
        IsInfinite = isInfinite;
    }
}