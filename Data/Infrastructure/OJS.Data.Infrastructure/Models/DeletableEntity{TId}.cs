namespace OJS.Data.Infrastructure.Models
{
    using System;

    public class DeletableEntity<TId> : Entity<TId>, IDeletableEntity<TId>
    {
        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}