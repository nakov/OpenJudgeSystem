namespace OJS.Servers.Ui.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Common.Enumerations;
using OJS.Common.Utils;
using OJS.Servers.Infrastructure.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureBuilder<TProgram>(this WebApplicationBuilder builder)
    {
        EnvironmentUtils.ValidateApplicationUrlsExist(new []
        {
            ApplicationName.Ui,
            ApplicationName.Administration,
        });

        builder.Services.ConfigureServices<TProgram>(builder.Configuration);
        builder.Host.UseFileLogger<TProgram>();

        return builder;
    }
}