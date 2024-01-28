using System.Text.Json;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class EntityPlayedConfiguration : IEntityTypeConfiguration<EntityPlayed>
{
    public void Configure(EntityTypeBuilder<EntityPlayed> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.HasOne(e => e.GamePlayed)
            .WithMany(eg => eg.Entities)
            .HasForeignKey(e => e.GamePlayedId);
        
        builder.HasOne(e => e.Owner)
            .WithMany()
            .HasForeignKey(e => e.OwnerId);
        
        builder.HasOne(e => e.LastActorTouched)
            .WithMany();
    }
}