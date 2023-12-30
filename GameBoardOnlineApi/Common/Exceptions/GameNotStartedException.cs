namespace Common.Exceptions;

public class GameNotStartedException(Exception? innerException = null) : GameBoardOnlineException($"Le jeu n'a pas commencé", innerException)
{
    
}