namespace OJS.Servers.Worker.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Configurations;

internal static class WebApplicationExtensions
{
    public static WebApplication ConfigureWebApplication(this WebApplication app)
    {
        app.UseDefaults();

        var healthCheckConfig = app.Services.GetRequiredService<IOptions<HealthCheckConfig>>().Value;

        // Health check endpoint with password protection for external services (like Legacy Judge)
        app.MapWhen(
            httpContext =>
                httpContext.Request.Query.TryGetValue(healthCheckConfig.Key, out var healthPassword)
                && healthPassword == healthCheckConfig.Password,
            appBuilder => appBuilder.UseHealthChecks("/health", new HealthCheckOptions
            {
                // Exclude all checks from the response, just validate service is up
                Predicate = _ => false,
            }));

        return app;
    }
}