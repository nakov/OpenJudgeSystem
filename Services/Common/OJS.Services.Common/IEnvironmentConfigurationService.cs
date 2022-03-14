namespace OJS.Services.Common;

using OJS.Common.Enumerations;
using SoftUni.Services.Infrastructure;

public interface IEnvironmentConfigurationService : IService
{
    string? GetValue(string key);

    string? GetApplicationUrl(ApplicationName appName);
}