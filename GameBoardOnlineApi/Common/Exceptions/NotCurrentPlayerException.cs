using Common.Context;
using Common.Models;

namespace Common.Exceptions;

public class NotCurrentPlayerException(Player? player, Exception? innerException = null)
    : GameBoardOnlineException($"C'est au tour de {player?.Name} de jouer", innerException);