namespace OJS.Servers.Infrastructure.Extensions
{
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.FileProviders;
    using Microsoft.Extensions.Hosting;
    using OJS.Servers.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Middleware;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using System;
    using System.IO;
    using static OJS.Common.GlobalConstants.Urls;

    public static class WebApplicationExtensions
    {
        public static WebApplication UseDefaults(this WebApplication app)
        {
            app.UseCustomExceptionHandling();

            app.UseAutoMapper();

            // app.UseHttpsRedirection();
            if (app.Environment.IsDevelopment())
            {
                app.UseStaticFiles();
            }
            else
            {
                var reactFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "build");
                Console.WriteLine(reactFilesPath);
                app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(reactFilesPath), });
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            return app;
        }

        public static WebApplication MapDefaultRoutes(this WebApplication app)
        {
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            return app;
        }

        public static WebApplication UseAndMapHangfireDashboard(this WebApplication app)
        {
            var dashboardOptions = new DashboardOptions
            {
                Authorization = new[] { new HangfireAuthorizationFilter() },
            };

            app.UseHangfireDashboard(HangfirePath);
            app.MapHangfireDashboard(dashboardOptions);

            return app;
        }

        private static WebApplication UseCustomExceptionHandling(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(errorApp => errorApp.Run(Rfc7807ExceptionMiddleware.Get));
            }

            return app;
        }
    }
}