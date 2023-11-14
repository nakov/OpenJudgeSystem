namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.FileProviders;
    using Microsoft.Extensions.Hosting;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(
            this WebApplication app,
            string apiVersion)
        {
            app.UseCors(o => o.WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
            app
                .UseDefaults()
                .MapDefaultRoutes();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwaggerDocs(apiVersion.ToApiName());
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    "default",
                    "{controller=Home}/{action=Index}");
            });

            return app;
        }
    }
}