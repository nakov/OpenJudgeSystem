namespace OJS.Servers.Worker.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Infrastructure.Extensions;

internal static class WebApplicationExtensions
{
    public static WebApplication ConfigureWebApplication(this WebApplication app)
    {
        app.UseCustomExceptionHandling();
        app.UseAutoMapper();
        app.MapControllers();

        app.UseHealthMonitoring();
        return app;
    }
}