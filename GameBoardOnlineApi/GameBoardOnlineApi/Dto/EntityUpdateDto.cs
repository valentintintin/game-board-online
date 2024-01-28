namespace GameBoardOnlineApi.Dto;

public class EntityUpdateDto
{
    public int X { get; set; }
    public int Y { get; set; }
    public int Rotation { get; set; }
    public bool ShowBack { get; set; }
}