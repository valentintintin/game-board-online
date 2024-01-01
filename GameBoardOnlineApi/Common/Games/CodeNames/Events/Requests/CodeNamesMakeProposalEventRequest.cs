namespace Common.Games.CodeNames.Events.Requests;

public record CodeNamesMakeProposalEventRequest
{
    public string Word { get; init; } = null!;

    public Guid HintId { get; init; }
}