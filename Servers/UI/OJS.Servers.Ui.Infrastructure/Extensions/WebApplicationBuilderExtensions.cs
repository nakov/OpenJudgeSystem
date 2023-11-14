namespace OJS.Servers.Ui.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Infrastructure.Extensions;
using Microsoft.Extensions.DependencyInjection;

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
                "AllowSpecificOrigin",
                builder => builder.WithOrigins("http://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        return builder;
    }
}