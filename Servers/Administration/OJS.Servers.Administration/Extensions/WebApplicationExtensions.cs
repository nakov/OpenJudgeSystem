namespace OJS.Servers.Administration.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Data;
using OJS.Servers.Administration.Middleware;
using OJS.Servers.Infrastructure.Extensions;
using static OJS.Common.GlobalConstants.Roles;

internal static class WebApplicationExtensions
{
    public static WebApplication ConfigureWebApplication(this WebApplication app, IConfiguration configuration)
    {
        app.UseCorsPolicy();
        app.UseDefaults();

        app.UseMiddleware<AdministrationExceptionMiddleware>();
        app.MigrateDatabase<OjsDbContext>(configuration);

        app.SeedRoles();
        app.SeedSettings();
        app.SeedMentorPromptTemplates();

        app
            .MapHealthChecksUI()
            .RequireAuthorization(auth => auth.RequireRole(Administrator));

        return app
            .UseAndMapHangfireDashboard();
    }

    private static WebApplication SeedSettings(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        scope.ServiceProvider
            .SeedSettings()
            .GetAwaiter()
            .GetResult();

        return app;
    }

    private static WebApplication SeedMentorPromptTemplates(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        scope.ServiceProvider
            .SeedMentorPromptTemplates()
            .GetAwaiter()
            .GetResult();

        return app;
    }
}
