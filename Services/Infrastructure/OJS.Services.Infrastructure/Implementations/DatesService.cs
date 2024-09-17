namespace OJS.Services.Infrastructure.Implementations
{
    using System;

    public class DatesService : IDatesService
    {
        public DateTime GetUtcNow()
            => DateTime.UtcNow;

        public DateTimeOffset GetUtcNowOffset()
            => DateTimeOffset.UtcNow;

        public DateTime GetMaxValue()
            => DateTime.MaxValue;

        public DateTime GetAbsoluteExpirationBySeconds(int seconds)
            => this.GetUtcNow().AddSeconds(seconds);
    }
}