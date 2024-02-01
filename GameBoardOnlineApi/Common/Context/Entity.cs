using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Common.Models;
using Common.Models.Interfaces;

namespace Common.Context;

public record Entity : IEntity
{
    public long Id { get; set; }

    [MaxLength(64)]
    public required string Name { get; set; }

    public virtual required EntityGroup Group { get; set; }
    public long GroupId { get; set; }
    
    public int Order { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int Rotation { get; set; } 
    public bool ShowBack { get; set; }
    
    public bool CanMove { get; set; }
    public bool CanFlip { get; set; }
    public bool CanRotate { get; set; }
    public bool CanBeDeleted { get; set; }
    
    public bool OnlyForOwner { get; set; }
    
    public bool AllowFlipOnce { set; get; }

    [MaxLength(256)]
    public required string Image { get; set; }
    
    [MaxLength(256)]
    public string? ImageBack { get; set; }
}