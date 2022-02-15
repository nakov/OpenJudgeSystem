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
                .MapDefaultRoutes()
                .UseAndMapHangfireDashboard();

        private static WebApplication UseAutoCrudAdmin(this WebApplication app)
        {
            var adminOptions = new AutoCrudAdminOptions
            {
                Authorization = new []{ new AutoCrudAdminAuthFilter() },
            };

            app.AddAutoCrudAdmin(options: adminOptions);

            return app;
        }
    }
}