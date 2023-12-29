using Common.Extensions;
using Common.Games.CodeNames.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Games.CodeNames.ContextConfigurations;

public class CodeNamesWordCardConfiguration : IEntityTypeConfiguration<CodeNamesWordCard>
{
    public void Configure(EntityTypeBuilder<CodeNamesWordCard> builder)
    {
        builder.Property(g => g.Team)
            .EnumToString(16);
    }
}