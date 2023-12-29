namespace Common.Games.CodeNames.Events;

public record CodeNamesMakeProposalEvent
{
    public string Word { get; init; } = null!;
}