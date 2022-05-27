namespace OJS.Services.Infrastructure
{
    using SoftUni.Services.Infrastructure;
    using System;

    public interface IDatesService : ISingletonService
    {
        DateTime GetUtcNow();

        DateTime GetMaxValue();
    }
}