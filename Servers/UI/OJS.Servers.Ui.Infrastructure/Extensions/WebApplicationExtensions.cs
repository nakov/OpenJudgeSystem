using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.FileProviders;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication ConfigureWebApplication(
            this WebApplication app,
            string apiVersion)
        {
            app
                .UseDefaults()
                .MapDefaultRoutes();

            if (app.Environment.IsDevelopment())
            {
                // app.UseStaticFiles();
                var reactFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "dist");
                Console.WriteLine(reactFilesPath);
                app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(reactFilesPath), });
                app.UseSwaggerDocs(apiVersion.ToApiName());
            }
            else
            {
                var reactFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "build");
                Console.WriteLine(reactFilesPath);
                app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(reactFilesPath), });
            }

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