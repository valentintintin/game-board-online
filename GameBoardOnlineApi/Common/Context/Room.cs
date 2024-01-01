using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record Room : IEntity, ICreated
{
    [Key]
    public Guid Id { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    [MaxLength(128)]
    public required string Name { get; set; }
    
    public virtual required User Owner { get; set; }
    
    public virtual Game? CurrentGame { get; set; }
    
    public virtual ICollection<User> Users { get; set; } = [];
    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = [];
}