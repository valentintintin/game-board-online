using Common.Games.CodeNames.Models;

namespace Common.Games.CodeNames.Events.Requests;

public record CodeNamesGiveHintEventRequest
{
    public string Hint { get; init; } = null!;
    public int Nb { get; init; }
    public CodeNamesHint.HintType Type { get; init; }
}