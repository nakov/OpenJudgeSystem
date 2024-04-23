namespace OJS.Data.Models.Common
{
    public interface IDeletableAuditInfoEntity<TId> : IDeletableEntity<TId>, IAuditInfoEntity<TId>, IDeletableAuditInfoEntity
    {
    }
}