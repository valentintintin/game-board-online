using Common.Games.CodeNames.Models;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class VirtualEntityConfiguration : IEntityTypeConfiguration<VirtualEntity>
{
    public void Configure(EntityTypeBuilder<VirtualEntity> builder)
    {
        builder
            .HasDiscriminator()
            .HasValue<CodeNamesHint>(nameof(CodeNamesHint));
    }
}