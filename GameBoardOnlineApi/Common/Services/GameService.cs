using Common.Context;
using Common.Exceptions;
using Common.Extensions;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public abstract class GameService<TGame, TPlayer, TAction>(ILogger<GameService<TGame, TPlayer, TAction>> logger, DataContext context) : AService(logger)
    where TPlayer : Player where TGame : Game
{
    public TGame InitializeGame(Room room)
    {
        var game = InitializeGameForRoom(room);
        
        room.CurrentGame = game;
        
        context.Update(room);
        context.SaveChanges();
        
        return game;
    }

    protected abstract TGame InitializeGameForRoom(Room room);

    public TGame DoAction(Room room, User user, TAction action, Dictionary<string, object?>? data)
    {
        if (room.CurrentGame == null)
        {
            throw new NoGameForRoomException();
        }
        
        var game = (TGame) room.CurrentGame;
        var player = (TPlayer) game.Players.First(p => p.User == user);
        
        game = DoActionForGame(room, game, player, action, data);

        SaveGame(room, game);
        
        return game;
    }
    
    protected abstract TGame DoActionForGame(Room room, TGame game, TPlayer player, TAction action, Dictionary<string, object?>? data);

    protected Room SaveGame(Room room, TGame game)
    {
        context.Update(room);
        context.SaveChanges();

        return room;
    }
    
    protected void CheckEnoughPlayers(Room room, int nb)
    {
        if (room.Users.Count < 4)
        {
            throw new NotEnoughPlayersException(4);
        }
    }
}