namespace OJS.Data.Infrastructure.Models
{
    using System;

    public interface IProcessedEntity : IEntity
    {
        DateTime ProcessedOn { get; set; }
    }
}