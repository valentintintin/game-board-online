using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record Game : IEntity
{
    public long Id { get; set; }

    [MaxLength(64)] 
    public required string Name { get; set; }

    public string Type { get; set; } = null!;
    
    public int MinPlayers { get; set; } = 2;
    
    public string? Image { get; set; }
    
    public bool Enabled { get; set; }

    public virtual ICollection<GamePlayed> Plays { get; set; } = [];
    public virtual ICollection<EntityGroup> EntitiesGroups { get; set; } = [];
}