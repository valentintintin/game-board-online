using Common.Context;
using Common.Models;

namespace Common.Exceptions;

public class NotCurrentTeamException(string team, Exception? innerException = null)
    : GameBoardOnlineException($"C'est au tour de l'équipe {team} de jouer", innerException);