using Common.Context.Configurations;
using Common.Games.CodeNames.Models;
using Common.Models;
using Common.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Common.Context;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public required DbSet<User> Users { get; init; }
    public required DbSet<Room> Rooms { get; init; }
    public required DbSet<ChatMessage> ChatMessages { get; init; }
    
    public required DbSet<Game> Games { get; init; }
    public required DbSet<Player> Players { get; init; }
    public required DbSet<Entity> Entities { get; init; }
    public required DbSet<VirtualEntity> VirtualEntities { get; init; }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ComputeEntitiesBeforeSaveChanges();
        
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GameConfiguration).Assembly);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        ComputeEntitiesBeforeSaveChanges();
        
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void ComputeEntitiesBeforeSaveChanges()
    {
        foreach (var entityEntry in ChangeTracker.Entries())
        {
            if (entityEntry.Entity is ICreated entity)
            {
                switch (entityEntry.State)
                {
                    case EntityState.Added:
                        entity.CreatedAt = DateTime.UtcNow;
                        break;
                }
            }
        }
    }
}