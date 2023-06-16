namespace OJS.Servers.Infrastructure.Extensions;

using Common.Utils;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using static Common.GlobalConstants.EnvironmentVariables;

public static class LaunchSettingsValidationExtensions
{
    public static IServiceCollection ValidateLaunchSettings(this IServiceCollection services, params string[] configurationValues)
    {
        var requiredGlobalConfigValues = new List<string>
        {
            DistributorBaseUrlKey,
            ApplicationUrl,
            RedisConnectionString,
            SharedAuthCookieDomain,
        };

        requiredGlobalConfigValues.AddRange(configurationValues);

        EnvironmentUtils.ValidateEnvironmentVariableExists(requiredGlobalConfigValues);

        return services;
    }
}