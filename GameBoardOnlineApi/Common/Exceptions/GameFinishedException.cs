namespace Common.Exceptions;

public class GameFinishedException(Exception? innerException = null) : GameBoardOnlineException($"Le jeu est terminé", innerException)
{
    
}