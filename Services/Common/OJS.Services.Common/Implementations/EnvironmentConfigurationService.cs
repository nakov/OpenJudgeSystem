namespace OJS.Services.Common.Implementations;

using OJS.Common.Enumerations;
using OJS.Common.Utils;

public class EnvironmentConfigurationService : IEnvironmentConfigurationService
{
    public string? GetValue(string key)
        => EnvironmentUtils.GetByKey(key);

    public string? GetApplicationUrl(ApplicationName appName)
        => EnvironmentUtils.GetApplicationUrl(appName);
}