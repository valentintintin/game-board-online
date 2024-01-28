using Common.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public abstract class AService : IAsyncDisposable, IDisposable
{
    protected AService(ILogger<AService> logger, IDbContextFactory<DataContext> dbContextFactory)
    {
        Logger = logger;
        Context = dbContextFactory.CreateDbContext();
    }

    protected ILogger<AService> Logger { get; set; }
    protected DataContext Context { get; set; }

    public async ValueTask DisposeAsync()
    {
        await Context.DisposeAsync();
    }

    public void Dispose()
    {
        Context.Dispose();
    }
}