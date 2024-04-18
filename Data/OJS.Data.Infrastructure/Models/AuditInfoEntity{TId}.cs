namespace OJS.Data.Infrastructure.Models
{
    using System;

    public class AuditInfoEntity<TId> : Entity<TId>, IAuditInfoEntity<TId>
    {
        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}