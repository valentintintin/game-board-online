using Common.Extensions;
using Common.Games.CodeNames.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Games.CodeNames.ContextConfigurations;

public class CodeNamesGameConfiguration : IEntityTypeConfiguration<CodeNamesGame>
{
    public void Configure(EntityTypeBuilder<CodeNamesGame> builder)
    {
        builder.Property(g => g.CurrentTeam)
            .EnumToString(16);
        
        builder.Property(g => g.TeamBeginning)
            .EnumToString(16);
    }
}