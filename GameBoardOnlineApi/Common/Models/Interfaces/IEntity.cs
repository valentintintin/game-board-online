namespace Common.Models.Interfaces;

public interface IEntity
{
    Guid Id { get; set; }
    
    string Name { get; set; }
}