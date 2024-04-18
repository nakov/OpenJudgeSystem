namespace OJS.Data.Models.Common
{
    using System;

    public interface IAuditInfoEntity : IEntity
    {
        DateTime CreatedOn { get; set; }

        DateTime? ModifiedOn { get; set; }
    }
}