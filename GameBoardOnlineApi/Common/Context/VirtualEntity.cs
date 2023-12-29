using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Common.Models.Interfaces;

namespace Common.Context;

public record VirtualEntity : ICreated, IGameEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }

    [MaxLength(64)]
    public required string Name { get; set; }
    
    public virtual required Game Game { get; set; }
    
    public virtual Player? Owner { get; set; }

    protected VirtualEntity()
    {
    }
    
    [SetsRequiredMembers]
    protected VirtualEntity(Game game, string name)
    {
        Game = game;
        Name = name;
    }
}