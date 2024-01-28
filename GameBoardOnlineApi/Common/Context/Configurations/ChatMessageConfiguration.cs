using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.HasOne(c => c.Room)
            .WithMany(r => r.ChatMessages)
            .HasForeignKey(c => c.RoomId);
        
        builder.HasOne(c => c.User)
            .WithMany(r => r.ChatMessages);
    }
}