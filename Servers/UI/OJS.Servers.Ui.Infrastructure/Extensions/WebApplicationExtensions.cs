using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(this WebApplication app)
        {
            app
                .UseDefaults()
                .MapDefaultRoutes();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    "default",
                    "{controller=Home}/{action=Index}");
                endpoints.MapFallbackToController("index", "home");
            });

            if (app.Environment.IsDevelopment())
            {
                app.UseSpaStaticFiles();
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";
                    if (app.Environment.IsDevelopment())
                    {
                        // spa.UseProxyToSpaDevelopmentServer("htp://");
                        spa.UseReactDevelopmentServer(npmScript: "start");
                    }
                });
            }



            return app;
        }
    }
}