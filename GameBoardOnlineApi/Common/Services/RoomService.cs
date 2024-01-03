using Common.Context;
using Microsoft.Extensions.Logging;

namespace Common.Services;

public class RoomService(ILogger<RoomService> logger, DataContext context) : AService(logger)
{
    public Room Create(User owner, string name)
    {
        Room room = new()
        {
            Name = name,
            Owner = owner,
            Users = [owner]
        };

        context.Add(room);
        context.SaveChanges();

        return room;
    }

    public Room Join(Room room, User user)
    {
        room.Users.Add(user);

        context.Update(room);
        context.SaveChanges();

        return room;
    }

    public Room Leave(Room room, User user)
    {
        room.Users.Remove(user);

        context.Update(room);
        context.SaveChanges();

        return room;
    }

    public ChatMessage SendChatMessage(Room room, string message, User? user = null)
    {
        var chatMessage = new ChatMessage
        {
            User = user,
            Room = room,
            Name = message
        };

        room.ChatMessages.Add(chatMessage);
        
        context.Update(room);
        context.SaveChanges();

        return chatMessage;
    }
}