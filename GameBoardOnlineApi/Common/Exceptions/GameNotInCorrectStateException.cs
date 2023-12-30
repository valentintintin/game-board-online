namespace Common.Exceptions;

public class GameNotInCorrectStateException(string? state, Exception? innerException = null) : GameBoardOnlineException($"Le jeu n'est pas dans le bon état {state}", innerException)
{
    
}