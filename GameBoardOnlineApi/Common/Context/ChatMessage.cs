using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public class ChatMessage : IEntity, ICreated
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    
    [MaxLength(512)]
    public required string Name { get; set; }
    
    public virtual required User User { get; set; }
    
    public virtual required Room Room { get; set; } 
}