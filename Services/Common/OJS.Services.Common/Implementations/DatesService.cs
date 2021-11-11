namespace OJS.Services.Common.Implementations
{
    using System;

    public class DatesService : IDatesService
    {
        public DateTime GetUtcNow() => DateTime.UtcNow;
    }
}