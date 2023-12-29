namespace Common.Exceptions;

public class GameBoardOnlineException(string message, Exception? innerException = null)
    : Exception(message, innerException);