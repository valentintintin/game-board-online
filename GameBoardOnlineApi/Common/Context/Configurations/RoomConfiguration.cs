using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder
            .HasOne(g => g.Owner)
            .WithMany(u => u.RoomsCreated)
            .HasForeignKey(r => r.OwnerId);

        builder
            .HasOne(r => r.CurrentGame)
            .WithOne()
            .HasForeignKey<Room>(r => r.CurrentGameId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}