using System.Text.Json;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class EntityGroupConfiguration : IEntityTypeConfiguration<EntityGroup>
{
    public void Configure(EntityTypeBuilder<EntityGroup> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.HasOne(eg => eg.Game)
            .WithMany(g => g.EntitiesGroups)
            .HasForeignKey(eg => eg.GameId);

        builder.Property(g => g.Randomize)
            .EnumToStringNotRequired();
    }
}