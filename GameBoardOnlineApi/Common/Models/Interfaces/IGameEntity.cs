using Common.Context;

namespace Common.Models.Interfaces;

public interface IGameEntity : IEntity
{
    Game Game { get; set; }
    Player? Owner { get; set; }
}