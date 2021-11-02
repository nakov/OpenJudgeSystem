namespace OJS.Data.Infrastructure.Models
{
    using System;

    public class AuditInfoEntity : IAuditInfoEntity
    {
        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}