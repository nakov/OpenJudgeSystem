namespace OJS.Data.Infrastructure.Models
{
    public interface IDeletableAuditInfoEntity<TId> : IDeletableEntity<TId>, IAuditInfoEntity<TId>, IDeletableAuditInfoEntity
    {
    }
}