namespace OJS.Services.Infrastructure
{
    using System;

    public interface IDatesService : ISingletonService
    {
        DateTime GetUtcNow();

        DateTime GetMaxValue();

        DateTime GetAbsoluteExpirationBySeconds(int seconds);
    }
}