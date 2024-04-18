namespace OJS.Data.Models.Common
{
    using System;

    public interface IProcessedEntity : IEntity
    {
        DateTime ProcessedOn { get; set; }
    }
}