namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin;
    using AutoCrudAdmin.Extensions;
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Administration.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(this WebApplication app)
            => app
                .UseDefaults()
                .UseAutoCrudAdmin()
                .MapRoutes()
                .UseAndMapHangfireDashboard();

        private static WebApplication UseAutoCrudAdmin(this WebApplication app)
        {
            var options = new AutoCrudAdminOptions
            {
                Authorization = new []{ new AutoCrudAdminAuthFilter() },
                LayoutName = "_Layout",
            };

            app.AddAutoCrudAdmin(options: options);

            return app;
        }

        private static WebApplication MapRoutes(this WebApplication app)
        {
            app.MapDefaultRoutes();
            app.MapRazorPages();

            return app;
        }
    }
}