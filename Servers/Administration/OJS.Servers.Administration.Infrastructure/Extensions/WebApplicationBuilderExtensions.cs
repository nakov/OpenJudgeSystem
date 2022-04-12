namespace OJS.Servers.Administration.Infrastructure.Extensions;

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
        });

        builder.Services.ConfigureServices<TProgram>();
        builder.Host.UseFileLogger<TProgram>();

        return builder;
    }
}