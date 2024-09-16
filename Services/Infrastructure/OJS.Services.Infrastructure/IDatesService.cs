namespace OJS.Services.Infrastructure
{
    using System;

    public interface IDatesService : ISingletonService
    {
        DateTime GetUtcNow();

        DateTimeOffset GetUtcNowOffset();

        DateTime GetMaxValue();

        DateTime GetAbsoluteExpirationBySeconds(int seconds);
    }
}