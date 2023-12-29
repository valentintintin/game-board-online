namespace Common.Exceptions;

public class NoGameForRoomException(Exception? innerException = null) : GameBoardOnlineException($"Aucun jeu de lancé", innerException);