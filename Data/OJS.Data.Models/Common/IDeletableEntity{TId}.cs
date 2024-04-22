namespace OJS.Data.Models.Common
{
    public interface IDeletableEntity<TId> : IEntity<TId>, IDeletableEntity
    {
    }
}