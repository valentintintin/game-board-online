using System.ComponentModel.DataAnnotations;
using Common.Models;
using Common.Models.Interfaces;

namespace Common.Context;

public record User : IEntity, ICreated
{
    [Key]
    public Guid Id { get; set; }
    
    [MaxLength(128)]
    public required string Name { get; set; }
    
    [MaxLength(8)]
    public required string Color { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public virtual ICollection<Room> RoomsCreated { get; set; } = [];
    public virtual ICollection<Player> Players { get; set; } = [];
}