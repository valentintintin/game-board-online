namespace Common.Exceptions;

public class UnauthorizedException(string message, Exception? innerException = null)
    : GameBoardOnlineException(message, innerException);