namespace OJS.Servers.Administration.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Data;
using OJS.Servers.Administration.Middleware;
using OJS.Servers.Infrastructure.Extensions;

internal static class WebApplicationExtensions
{
    public static WebApplication ConfigureWebApplication(this WebApplication app)
    {
        app.UseCorsPolicy();
        app
            .UseDefaults()
            .UseStaticFiles();

        app.UseMiddleware<AdministrationExceptionMiddleware>();
        app.MigrateDatabase<OjsDbContext>();
        app.SeedRoles();

        app.UseHealthMonitoring();
        app.MapControllers();

        return app
            .UseAndMapHangfireDashboard();
    }
}
