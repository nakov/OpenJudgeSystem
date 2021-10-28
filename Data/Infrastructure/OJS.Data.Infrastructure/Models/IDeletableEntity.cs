namespace OJS.Data.Infrastructure.Models
{
    using System;

    public interface IDeletableEntity : IEntity
    {
        bool IsDeleted { get; set; }

        DateTime? DeletedOn { get; set; }
    }
}