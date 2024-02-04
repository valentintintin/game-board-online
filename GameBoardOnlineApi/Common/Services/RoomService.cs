using Common.Context;
using Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public class RoomService(ILogger<RoomService> logger, IDbContextFactory<DataContext> dbContextFactory)
    : AService(logger, dbContextFactory)
{
    public Room Create(long ownerId, string name)
    {
        var owner = Context.Users.FindOrThrow(ownerId);
        
        Room room = new()
        {
            Name = name,
            Owner = owner,
            Users = [owner]
        };

        Context.Add(room);
        Context.SaveChanges();

        return room;
    }

    public Room Join(long roomId, long userId)
    {
        var room = Context.Rooms
            .Include(r => r.Users)
            .FindOrThrow(roomId);
        var user = Context.Users.FindOrThrow(userId);
        
        if (room.Users.Any(u => u == user))
        {
            return room;
        }
        
        room.Users.Add(user);

        Context.Update(room);
        Context.SaveChanges();

        SendChatMessage(roomId, $"{user.Name} est rentré dans le salon");

        return room;
    }

    public Room Leave(long roomId, long userId)
    {
        var room = Context.Rooms
            .Include(r => r.Users)
            .FindOrThrow(roomId);
        var user = Context.Users.FindOrThrow(userId);
        
        if (room.Users.All(u => u != user))
        {
            return room;
        }
        
        room.Users.Remove(user);

        Context.Update(room);
        Context.SaveChanges();

        SendChatMessage(roomId, $"{user.Name} a quité le salon");

        return room;
    }

    public Room SetCurrentGame(long gamePlayedId)
    {
        var gamePlayed = Context.GamePlayed
            .Include(g => g.Room)
            .FindOrThrow(gamePlayedId);

        gamePlayed.Room.CurrentGame = gamePlayed;

        Context.Update(gamePlayed.Room);
        Context.SaveChanges();
        
        return gamePlayed.Room;
    }

    public ChatMessage SendChatMessage(long roomId, string message, long? userId = null)
    {
        var room = Context.Rooms.FindOrThrow(roomId);
        var user = userId.HasValue ? Context.Users.FindOrThrow(userId) : null;
        
        var chatMessage = new ChatMessage
        {
            User = user,
            Room = room,
            Name = message
        };

        room.ChatMessages.Add(chatMessage);
        
        Context.Update(room);
        Context.SaveChanges();

        return chatMessage;
    }
}