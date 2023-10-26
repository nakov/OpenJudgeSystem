namespace OJS.Servers.Infrastructure.Extensions
{
    using System;
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using OJS.Servers.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Middleware;
    using OJS.Services.Common.Models.Configurations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using static OJS.Common.GlobalConstants.Urls;

    public static class WebApplicationExtensions
    {
        public static WebApplication UseDefaults(this WebApplication app)
        {
            app.UseCustomExceptionHandling();

            app.UseAutoMapper();

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

        public static WebApplication UseSwaggerDocs(this WebApplication app, string name)
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint($"/swagger/{name}/swagger.json", name);
            });

            return app;
        }

        public static WebApplication UseCustomExceptionHandling(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler(errorApp => errorApp.Run(new DevelopmentExceptionMiddleware().Get));
            }
            else
            {
                app.UseExceptionHandler(errorApp => errorApp.Run(new Rfc7807ExceptionMiddleware().Get));
            }

            return app;
        }

        public static void UseHealthMonitoring(this WebApplication app)
        {
            var heathCheckConfig = app.Configuration.GetSection(nameof(HealthCheckConfig)).Get<HealthCheckConfig>();

            Func<HttpContext, bool> healthMonitoringPredicate =
                httpContext => httpContext.Request.Query.ContainsKey(heathCheckConfig.Key) &&
                               httpContext.Request.Query[heathCheckConfig.Key] == heathCheckConfig.Password;

            app.MapWhen(healthMonitoringPredicate, appBuilder => appBuilder.UseHealthChecks("/health"));
        }
    }
}