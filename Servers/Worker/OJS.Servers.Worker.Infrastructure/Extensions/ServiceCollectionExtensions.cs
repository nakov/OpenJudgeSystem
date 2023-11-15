namespace OJS.Servers.Worker.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Helpers;
    using OJS.Data;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Worker.Models.Configuration;
    using OJS.Workers.Common;
    using OJS.Workers.SubmissionProcessors;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using ApplicationConfig = OJS.Services.Worker.Models.Configuration.ApplicationConfig;

    public static class ServiceCollectionExtensions
    {
        public static void ConfigureServices<TProgram>(
            this IServiceCollection services,
            IConfiguration configuration)
            => services
                .AddWebServer<TProgram>()
                .AddHttpContextServices()
                .AddScoped<DbContext, OjsDbContext>()
                .AddSubmissionExecutor(configuration)
                .AddMemoryCache()
                .AddMessageQueue<TProgram>(configuration)
                .AddLogging()
                .AddSoftUniJudgeCommonServices()
                .AddOptionsWithValidation<ApplicationConfig>(nameof(ApplicationConfig))
                .AddOptionsWithValidation<SubmissionExecutionConfig>(nameof(SubmissionExecutionConfig))
                .AddControllers();

        public static WebApplication ConfigureWebApplication(this WebApplication app)
        {
            app.UseCustomExceptionHandling();
            app.UseAutoMapper();
            app.MapControllers();

            app.UseHealthMonitoring();
            return app;
        }

        public static IServiceCollection AddSubmissionExecutor(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var appConfig = configuration.GetSection(nameof(ApplicationConfig)).Get<ApplicationConfig>();
            SettingsHelper.ValidateSettings(nameof(ApplicationConfig), appConfig);

            return services
                .AddTransient<ISubmissionExecutor>(sp => new SubmissionExecutor(
                    appConfig.SubmissionsProcessorIdentifierNumber.ToString()));
        }
    }
}