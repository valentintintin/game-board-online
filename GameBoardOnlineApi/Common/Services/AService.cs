using Microsoft.Extensions.Logging;

namespace Common.Services;

public abstract class AService(ILogger<AService> logger)
{
    protected ILogger<AService> Logger { get; init; } = logger;
}