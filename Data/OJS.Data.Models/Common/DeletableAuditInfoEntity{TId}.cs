namespace OJS.Data.Models.Common
{
    using System;

    public class DeletableAuditInfoEntity<TId> : AuditInfoEntity<TId>, IDeletableAuditInfoEntity<TId>
    {
        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}