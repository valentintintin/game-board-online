using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Common.Models;
using Common.Models.Interfaces;

namespace Common.Context;

public abstract record Entity : IGameEntity
{
    public Guid Id { get; set; }

    [MaxLength(64)]
    public required string Name { get; set; }

    public virtual required Game Game { get; set; }
    
    public virtual Player? Owner { get; set; }
    public virtual Player? LastActorTouched { get; set; }
    
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int Rotation { get; set; } 
    
    public bool CanMove { get; set; }
    public bool CanFlip { get; set; }
    public bool CanRotate { get; set; }
    public bool CanBeDeleted { get; set; }
    
    public bool OnlyForOwner { get; set; }
    public bool CanBeShownToOthers { get; set; }
    
    public bool ShowBack { get; set; }
    public bool AllowFlipOnce { get; set; }
    
    public string? ShadowColor { get; set; }
    public required string Image { get; set; }
    public string? ImageBack { get; set; }

    protected Entity()
    {
    }
    
    [SetsRequiredMembers]
    protected Entity(Game game, string name, string image, string? imageBack)
    {
        Image = image;
        ImageBack = imageBack;
        Name = name;
        Game = game;
    }
}