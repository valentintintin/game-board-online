namespace Common.Exceptions;

public class NotFoundException : GameBoardOnlineException
{
    public NotFoundException(string typeEntity, object? key) : base($"{typeEntity} not found with key {key ?? "null"}") { }

    public NotFoundException(string message) : base(message) { }
}

public class NotFoundException<T>(object? key = null) : NotFoundException(typeof(T).Name, key);