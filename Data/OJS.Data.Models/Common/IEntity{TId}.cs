namespace OJS.Data.Models.Common
{
    public interface IEntity<TId> : IEntity
    {
        TId Id { get; set; }
    }
}