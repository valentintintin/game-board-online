using Common.Games.CodeNames.Models;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class EntityConfiguration : IEntityTypeConfiguration<Entity>
{
    public void Configure(EntityTypeBuilder<Entity> builder)
    {
        builder
            .HasDiscriminator()
            .HasValue<CodeNamesWordCard>(nameof(CodeNamesWordCard));
    }
}