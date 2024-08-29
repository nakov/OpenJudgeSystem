namespace OJS.Servers.Ui.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using OJS.Data;
    using OJS.Servers.Infrastructure.Extensions;

    internal static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(
            this WebApplication app,
            IConfiguration configuration,
            string apiVersion)
        {
            app.UseCorsPolicy();
            app.UseDefaults();

            app.MigrateDatabase<OjsDbContext>(configuration);

            if (app.Environment.IsDevelopment())
            {
                app.UseSwaggerDocs(apiVersion.ToApiName());
            }

            return app;
        }
    }
}