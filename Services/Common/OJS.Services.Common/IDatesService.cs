namespace OJS.Services.Common
{
    using SoftUni.Services.Infrastructure;
    using System;

    public interface IDatesService : ISingletonService
    {
        DateTime GetUtcNow();
    }
}