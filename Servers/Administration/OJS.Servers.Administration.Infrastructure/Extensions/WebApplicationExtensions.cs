namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin;
    using AutoCrudAdmin.Extensions;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Hosting;
    using OJS.Data;
    using OJS.Servers.Administration.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(this WebApplication app)
        {
            app
                .UseDefaults()
                .UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.MigrateDatabase<OjsDbContext>();
            }

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
}