namespace OJS.Services.Common;

using OJS.Common.Enumerations;
using SoftUni.Services.Infrastructure;

public interface IApplicationUrlsService : IService
{
    string? GetUrl(ApplicationName appName);

    string GetMainDomain();
}