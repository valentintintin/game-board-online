using Common.Games.CodeNames.Models;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder
            .HasDiscriminator()
            .HasValue<CodeNamesPlayer>(nameof(CodeNamesPlayer));
    }
}