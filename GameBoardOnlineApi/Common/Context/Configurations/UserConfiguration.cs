using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.HasMany(u => u.JoinedRooms)
            .WithMany(u => u.Users)
            .UsingEntity<RoomUser>(
                l => l.HasOne<Room>().WithMany().HasForeignKey(e => e.RoomId),
                r => r.HasOne<User>().WithMany().HasForeignKey(e => e.UserId));
    }
}