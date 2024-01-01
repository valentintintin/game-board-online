using Common.Context;
using Common.Exceptions;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public abstract class GameService<TGame, TPlayer, TAction>(ILogger<GameService<TGame, TPlayer, TAction>> logger, DataContext context) : AService(logger)
    where TPlayer : Player where TGame : Game where TAction : Enum
{
    public TGame InitializeGame(Room room, Dictionary<string, object?>? data = null)
    {
        var game = InitializeGameForRoom(room, data);
        
        room.CurrentGame = game;

        SaveGame(game);
        
        return game;
    }

    protected void SaveGame(TGame game)
    {
        context.Update(game);
        context.SaveChanges();
    }

    protected abstract TGame InitializeGameForRoom(Room room, Dictionary<string, object?>? data);

    protected TPlayer GetPlayerForUser(TGame game, User user)
    {
        return (TPlayer) game.Players.First(p => p.User == user);
    }
    
    protected void CheckEnoughPlayers(Room room, int nb)
    {
        if (room.Users.Count < 4)
        {
            throw new NotEnoughPlayersException(4);
        }
    }

    protected void CheckState<T>(Game game, T stateAllowed) where T : struct, Enum
    {
        CheckStates(game, [stateAllowed]);
    }
    
    protected void CheckStates<T>(Game game, List<T> statesAllowed) where T : struct, Enum
    {
        var currentState = game.GetCurrentState<T>();

        if (!currentState.HasValue)
        {
            throw new GameNotStartedException();
        }

        if (currentState.Value.ToString() == "End")
        {
            throw new GameFinishedException();
        }
        
        if (statesAllowed.Exists(s => s.CompareTo(currentState.Value) == 0))
        {
            return;
        }
        
        throw new GameNotInCorrectStateException(game.State);
    } 
}