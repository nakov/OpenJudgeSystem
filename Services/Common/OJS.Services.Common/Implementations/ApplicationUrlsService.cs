namespace OJS.Services.Common.Implementations;

using OJS.Common.Enumerations;
using System;

public class ApplicationUrlsService : IApplicationUrlsService
{
    private readonly IEnvironmentConfigurationService environmentConfiguration;

    public ApplicationUrlsService(IEnvironmentConfigurationService environmentConfiguration)
        => this.environmentConfiguration = environmentConfiguration;

    public string? GetUrl(ApplicationName appName)
        => this.environmentConfiguration.GetApplicationUrl(appName);

    public string GetUiUrlOrDefault()
        => this.GetUrl(ApplicationName.Ui) ?? "/";

    public string GetMainDomain()
        => new Uri(this.GetUrl(ApplicationName.Ui) ?? string.Empty).Authority;
}