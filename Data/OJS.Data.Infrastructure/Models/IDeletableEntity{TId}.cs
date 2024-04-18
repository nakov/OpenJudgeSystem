namespace OJS.Data.Infrastructure.Models
{
    public interface IDeletableEntity<TId> : IEntity<TId>, IDeletableEntity
    {
    }
}