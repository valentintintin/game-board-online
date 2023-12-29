using System.Diagnostics.CodeAnalysis;
using Common.Context;

namespace Common.Games.CodeNames.Models;

public record CodeNamesHint : VirtualEntity
{
    public required string Word { get; set; }
    public required int Nb { get; set; }

    public CodeNamesHint()
    {
    }
    
    [SetsRequiredMembers]
    public CodeNamesHint(Game game, Player player, string word, int nb) : base(game, $"Indice {word} {nb}")
    {
        Owner = player;
        Word = word;
        Nb = nb;
    }
}