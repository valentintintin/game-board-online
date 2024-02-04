using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public class EntityGroup : IEntity
{
    public long Id { get; set; }

    [MaxLength(64)]
    public required string Name { get; set; }

    public virtual required Game Game { get; set; }
    public long GameId { get; set; }
    
    public bool Randomize { get; set; }
    public bool CanRemoveNotUsed { get; set; }
    public int NumberToGiveToPlayer { get; set; }
    
    [MaxLength(256)]
    public string? ImageBack { get; set; }

    public virtual ICollection<Entity> Entities { get; set; } = [];
}