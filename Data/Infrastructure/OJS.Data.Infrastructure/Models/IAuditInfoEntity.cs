namespace OJS.Data.Infrastructure.Models
{
    using System;

    public interface IAuditInfoEntity : IEntity
    {
        DateTime CreatedOn { get; set; }

        DateTime? ModifiedOn { get; set; }
    }
}