namespace OJS.Servers.Ui.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Models.Configurations;
using Microsoft.Extensions.DependencyInjection;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureBuilder<TProgram>(
        this WebApplicationBuilder builder,
        string apiVersion)
    {
        builder.Configuration.AddEnvironmentVariables($"{nameof(MessageQueueConfig)}_");
        builder.Configuration.AddEnvironmentVariables($"{nameof(EmailServiceConfig)}_");
        builder.Services.ConfigureServices<TProgram>(builder.Configuration, apiVersion);
        builder.Host.UseFileLogger<TProgram>();

        return builder;
    }
}