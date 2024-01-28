namespace Common.Exceptions;

public class ForbiddenGameActionException(string action, Exception? innerException = null) : GameBoardOnlineException($"Vous ne pouvez pas faire l'action : {action} sur cet objet", innerException)
{
    
}