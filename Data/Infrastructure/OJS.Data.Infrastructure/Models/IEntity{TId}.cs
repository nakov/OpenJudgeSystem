namespace OJS.Data.Infrastructure.Models
{
    public interface IEntity<out TId>
    {
        TId Id { get; }
    }
}