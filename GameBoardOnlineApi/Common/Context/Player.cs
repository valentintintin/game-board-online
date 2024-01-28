using System.ComponentModel.DataAnnotations;
using Common.Models.Interfaces;

namespace Common.Context;

public record Player : IEntity
{
    public long Id { get; set; }

    public virtual required User User { get; set; }
    public long UserId { get; set; }

    public virtual required GamePlayed Game { get; set; }
    public long GameId { get; set; }
}