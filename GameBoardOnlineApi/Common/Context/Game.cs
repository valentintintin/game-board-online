using System.ComponentModel.DataAnnotations;
using Common.Games.CodeNames.Models;
using Common.Models.Interfaces;

namespace Common.Context;

public abstract record Game : IEntity, ICreated
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }

    [MaxLength(64)] 
    public required string Name { get; set; }

    public string Type { get; set; } = null!;

    public string? State { get; set; }

    public virtual ICollection<Player> Players { get; set; } = [];
    
    public virtual Player? CurrentPlayer { get; set; }
    public virtual Player? WinnerPlayer { get; set; }
    public virtual required Room Room { get; set; }

    public IEnumerable<T> GetPlayers<T>()
    {
        return Players.Cast<T>();
    }

    public void SetState<T>(T state) where T : Enum
    {
        State = state.ToString();
    }

    public T? GetCurrentState<T>() where T : struct, Enum
    {
        return State == null ? default : Enum.Parse<T>(State);
    }
}