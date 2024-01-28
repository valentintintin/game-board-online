using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class GamePlayedConfiguration : IEntityTypeConfiguration<GamePlayed>
{
    public void Configure(EntityTypeBuilder<GamePlayed> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder
            .HasOne(g => g.Room)
            .WithMany(r => r.Games)
            .HasForeignKey(g => g.RoomId);
        
        builder
            .HasOne(g => g.Game)
            .WithMany(g => g.Plays)
            .HasForeignKey(g => g.GameId);
    }
}