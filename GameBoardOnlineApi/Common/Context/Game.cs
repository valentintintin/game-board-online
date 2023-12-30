using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record Game : IEntity, ICreated
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }

    [MaxLength(64)] 
    public required string Name { get; set; }

    public string Type { get; set; } = null!;

    public virtual ICollection<Player> Players { get; set; } = [];
}