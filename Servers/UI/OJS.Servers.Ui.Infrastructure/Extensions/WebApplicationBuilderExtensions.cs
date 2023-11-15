namespace OJS.Servers.Ui.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Infrastructure.Extensions;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common;
public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureBuilder<TProgram>(
        this WebApplicationBuilder builder,
        string apiVersion)
    {
        builder.Services.ConfigureServices<TProgram>(builder.Configuration, apiVersion);
        builder.Host.UseFileLogger<TProgram>();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(
                GlobalConstants.CorsDefaultPolicyName,
                config => config.WithOrigins(builder.Configuration.GetSection("FRONTEND_URL").Value)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        return builder;
    }
}