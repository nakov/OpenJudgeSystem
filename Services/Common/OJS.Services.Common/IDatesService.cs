namespace OJS.Services.Common
{
    using OJS.Services.Infrastructure;
    using System;

    public interface IDatesService : ISingletonService
    {
        DateTime GetUtcNow();
    }
}