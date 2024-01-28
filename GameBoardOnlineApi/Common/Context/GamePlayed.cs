using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record GamePlayed : IEntity, ICreated
{
    public long Id { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public virtual required Game Game { get; set; }
    public long GameId { get; set; }

    public bool IsFinished { get; set; }
    
    public virtual ICollection<Player> Players { get; set; } = [];
    public virtual ICollection<EntityPlayed> Entities { get; set; } = [];
    
    public virtual required Room Room { get; set; }
    public long RoomId { get; set; }
}