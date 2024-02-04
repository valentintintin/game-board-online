using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record EntityPlayed : IEntity, ICreated
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual required GamePlayed GamePlayed { get; set; }
    public long GamePlayedId { get; set; }
    
    public virtual required Entity Entity { get; set; }
    public long EntityId { get; set; }
    
    public virtual Player? Owner { get; set; }
    public long? OwnerId { get; set; }
    
    public virtual Player? LastActorTouched { get; set; }
    public long? LastActorTouchedId { get; set; }
    
    public int X { get; set; }
    public int Y { get; set; }
    public int Rotation { get; set; }
    public int Order { get; set; }
    public bool ShowBack { get; set; }
    public bool Deleted { get; set; }
    public bool OnlyForOwner { get; set; }
    
    [MaxLength(32)]
    public string? Container { get; set; }
    
    public bool CanFlip { get; set; }
    
    public virtual EntityPlayed? LinkTo { get; set; }
    public long? LinkToId { get; set; }
    public virtual ICollection<EntityPlayed> EntitiesLinked { get; set; } = [];

    public bool IsInMainContainer() => Y >= 0;
}