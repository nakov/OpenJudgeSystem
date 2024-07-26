namespace OJS.Servers.Infrastructure.Extensions
{
    using AutoMapper;
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Diagnostics.HealthChecks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Diagnostics.HealthChecks;
    using Microsoft.Extensions.Hosting;
    using OJS.Common;
    using OJS.Servers.Infrastructure.Filters;
    using OJS.Servers.Infrastructure.Middleware;
    using OJS.Services.Infrastructure;
    using System.IO;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants.Urls;
    using static OJS.Servers.Infrastructure.ServerConstants.Authorization;

    public static class WebApplicationExtensions
    {
        public static WebApplication UseDefaults(this WebApplication app)
        {
            app.UseCustomExceptionHandling();

            app.UseAutoMapper();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHealthMonitoring();
            app.MapControllers();

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

        public static void MapHealthMonitoring(this WebApplication app)
            => app
                .MapHealthChecks("/api/health", new HealthCheckOptions
                {
                    ResponseWriter = WriteHealthResponse,
                })
                .RequireAuthorization(ApiKeyPolicyName);

        public static WebApplication MigrateDatabase<TDbContext>(this WebApplication app)
            where TDbContext : DbContext
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TDbContext>();

            dbContext.Database.Migrate();

            return app;
        }

        public static IApplicationBuilder UseAutoMapper(this IApplicationBuilder app)
        {
            var services = app.ApplicationServices;

            var mapper = services.GetRequiredService<IMapper>();

            AutoMapperSingleton.Init(mapper);

            return app;
        }

        private static Task WriteHealthResponse(HttpContext context, HealthReport healthReport)
        {
            context.Response.ContentType = "application/json; charset=utf-8";

            var options = new JsonWriterOptions { Indented = true };

            using var memoryStream = new MemoryStream();
            using (var jsonWriter = new Utf8JsonWriter(memoryStream, options))
            {
                jsonWriter.WriteStartObject();
                jsonWriter.WriteString("status", healthReport.Status.ToString());
                jsonWriter.WriteStartObject("results");

                foreach (var healthReportEntry in healthReport.Entries)
                {
                    jsonWriter.WriteStartObject(healthReportEntry.Key);
                    jsonWriter.WriteString("status", healthReportEntry.Value.Status.ToString());
                    jsonWriter.WriteString("description", healthReportEntry.Value.Description);
                    jsonWriter.WriteStartObject("data");

                    foreach (var item in healthReportEntry.Value.Data)
                    {
                        jsonWriter.WritePropertyName(item.Key);

                        JsonSerializer.Serialize(jsonWriter, item.Value, item.Value.GetType());
                    }

                    jsonWriter.WriteEndObject();
                    jsonWriter.WriteEndObject();
                }

                jsonWriter.WriteEndObject();
                jsonWriter.WriteEndObject();
            }

            return context.Response.WriteAsync(
                Encoding.UTF8.GetString(memoryStream.ToArray()));
        }
    }
}