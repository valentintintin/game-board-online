using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Context.Configurations;

public class EntityConfiguration : IEntityTypeConfiguration<Entity>
{
    public void Configure(EntityTypeBuilder<Entity> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.HasOne(e => e.Group)
            .WithMany(eg => eg.Entities)
            .HasForeignKey(e => e.GroupId);
    }
}