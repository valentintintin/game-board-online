namespace Common.Exceptions;

public class NotEnoughPlayersException(int playersRequired, Exception? innerException = null)
    : GameBoardOnlineException($"Il faut {playersRequired} joueurs minimum", innerException);