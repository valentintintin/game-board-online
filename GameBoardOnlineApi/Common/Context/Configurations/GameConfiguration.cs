using Common.Games.CodeNames.Models;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder
            .Property(g => g.Type)
            .HasColumnName("Discriminator");
        
        builder
            .HasDiscriminator(g => g.Type)
            .HasValue<CodeNamesGame>(nameof(CodeNamesGame));

        builder
            .HasMany(g => g.Players)
            .WithOne(p => p.Game);

        builder
            .HasOne(g => g.CurrentPlayer)
            .WithMany();

        builder
            .HasOne(g => g.WinnerPlayer)
            .WithMany();

        builder
            .HasOne(g => g.Room)
            .WithMany(r => r.Games);
    }
}