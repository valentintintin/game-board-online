namespace Common.Games.CodeNames.Events;

public record CodeNamesGiveHintEvent
{
    public string Hint { get; init; } = null!;
    public int Nb { get; init; }
}