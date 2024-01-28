using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder
            .HasOne(g => g.Game)
            .WithMany(p => p.Players)
            .HasForeignKey(p => p.GameId);
        
        builder
            .HasOne(g => g.User)
            .WithMany(p => p.Players)
            .HasForeignKey(p => p.UserId);
    }
}