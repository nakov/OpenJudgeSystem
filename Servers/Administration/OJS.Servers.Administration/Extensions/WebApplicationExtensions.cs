namespace OJS.Servers.Administration.Extensions;

using AutoCrudAdmin;
using AutoCrudAdmin.Extensions;
using Microsoft.AspNetCore.Builder;
using OJS.Data;
using OJS.Servers.Administration.Filters;
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

        app.UseHealthMonitoring();

        return app
            .UseAutoCrudAdmin()
            .MapDefaultRoutes()
            .UseAndMapHangfireDashboard();
    }

    private static WebApplication UseAutoCrudAdmin(this WebApplication app)
    {
        var options = new AutoCrudAdminOptions
        {
            Authorization = new[] { new AutoCrudAdminAuthFilter() }, LayoutName = "_Layout",
        };

        app.AddAutoCrudAdmin(options: options);

        return app;
    }
}
