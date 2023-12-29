using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Common.Models.Interfaces;

namespace Common.Context;

public record Player : IEntity
{
    public Guid Id { get; set; }

    [MaxLength(128)] 
    public required string Name { get; set; }

    public virtual required User User { get; set; }

    public virtual required Game Game { get; set; }
    
    protected Player()
    {
    }
    
    [SetsRequiredMembers]
    protected Player(Game game, User user)
    {
        Game = game;
        Name = user.Name;
        
        User = user;
    }
}