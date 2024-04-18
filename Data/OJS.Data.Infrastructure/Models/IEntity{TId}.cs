namespace OJS.Data.Infrastructure.Models
{
    public interface IEntity<TId> : IEntity
    {
        TId Id { get; set; }
    }
}