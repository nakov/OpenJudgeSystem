namespace OJS.Servers.Infrastructure.Extensions
{
    using AutoMapper;
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Options;
    using OJS.Common;
    using OJS.Servers.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Middleware;
    using OJS.Services.Infrastructure;
    using OJS.Services.Infrastructure.Configurations;
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

        public static WebApplication UseAndMapHangfireDashboard(this WebApplication app)
        {
            var dashboardOptions = new DashboardOptions
            {
                Authorization = new[] { new HangfireAuthorizationFilter() },
            };

            app.UseHangfireDashboard(HangfirePath, dashboardOptions);

            return app;
        }

        public static WebApplication UseCorsPolicy(this WebApplication app)
        {
            app.UseCors(GlobalConstants.CorsDefaultPolicyName);
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
            var healthCheckConfig = app.Services.GetRequiredService<IOptions<HealthCheckConfig>>().Value;

            app.MapWhen(
                httpContext =>
                    httpContext.Request.Query.TryGetValue(healthCheckConfig.Key, out var healthPassword)
                    && healthPassword == healthCheckConfig.Password,
                appBuilder => appBuilder.UseHealthChecks("/health"));
        }

        public static WebApplication MigrateDatabase<TDbContext>(this WebApplication app)
            where TDbContext : DbContext
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TDbContext>();

            dbContext.Database.Migrate();

            return app;
        }

        public static WebApplication AddRoles(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            scope.ServiceProvider.CreateOrUpdateRoles().GetAwaiter().GetResult();

            return app;
        }

        public static IApplicationBuilder UseAutoMapper(this IApplicationBuilder app)
        {
            var services = app.ApplicationServices;

            var mapper = services.GetRequiredService<IMapper>();

            AutoMapperSingleton.Init(mapper);

            return app;
        }
    }
}