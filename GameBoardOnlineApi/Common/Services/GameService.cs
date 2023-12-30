using Common.Context;
using Common.Exceptions;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public abstract class GameService<TGame, TPlayer, TAction>(ILogger<GameService<TGame, TPlayer, TAction>> logger, DataContext context) : AService(logger)
    where TPlayer : Player where TGame : Game
{
    public TGame InitializeGame(Room room, Dictionary<string, object?>? data = null)
    {
        var game = InitializeGameForRoom(room, data);
        
        room.CurrentGame = game;
        
        context.Update(room);
        context.SaveChanges();
        
        return game;
    }

    protected abstract TGame InitializeGameForRoom(Room room, Dictionary<string, object?>? data);

    public TGame DoAction(Room room, User user, TAction action, Dictionary<string, object?>? data = null)
    {
        if (room.CurrentGame == null)
        {
            throw new NoGameForRoomException();
        }
        
        var game = (TGame) room.CurrentGame;
        var player = (TPlayer) game.Players.First(p => p.User == user);
        
        game = DoActionForGame(room, game, player, action, data);

        context.Update(game);
        context.SaveChanges();
        
        return game;
    }
    
    protected abstract TGame DoActionForGame(Room room, TGame game, TPlayer player, TAction action, Dictionary<string, object?>? data);
    
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