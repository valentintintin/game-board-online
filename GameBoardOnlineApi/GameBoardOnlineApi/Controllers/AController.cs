using Microsoft.AspNetCore.Mvc;

namespace GameBoardOnlineApi.Controllers;

public abstract class AController(ILogger<AController> logger) : ControllerBase
{
    protected ILogger<AController> Logger { get; init; } = logger;
}