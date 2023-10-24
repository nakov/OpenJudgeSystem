﻿namespace OJS.Servers.Worker.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Diagnostics.HealthChecks;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Utils;
    using OJS.Data;
    using OJS.Servers.Infrastructure.Checks;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Worker.Models.Configuration;
    using OJS.Workers.Common;
    using OJS.Workers.SubmissionProcessors;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    public static class ServiceCollectionExtensions
    {
        private const string SubmissionsProcessorIdentifierNumberEnvVariableName =
            "SUBMISSIONS_PROCESSOR_IDENTIFIER_NUMBER";

        public static void ConfigureServices<TProgram>(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddWebServer<TProgram>()
                .AddScoped<DbContext, OjsDbContext>()
                .AddSubmissionExecutor()
                .AddMemoryCache()
                .AddMessageQueue<TProgram>(configuration)
                .AddLogging()
                .AddSoftUniJudgeCommonServices()
                .AddConfiguration(configuration)
                .AddControllers();

            services.AddHttpContextAccessor();
            services.AddHealthChecks().AddCheck<HealthCheck>(nameof(HealthCheck));
        }

        public static WebApplication ConfigureWebApplication(this WebApplication app)
        {
            app.UseCustomExceptionHandling();
            app.UseAutoMapper();
            app.MapControllers();

            app.UseHealthChecks("/health");
            return app;
        }

        public static IServiceCollection AddSubmissionExecutor(
            this IServiceCollection services)
            => services
                .AddTransient<ISubmissionExecutor>(sp => new SubmissionExecutor(
                    EnvironmentUtils.GetRequiredByKey(SubmissionsProcessorIdentifierNumberEnvVariableName)));

        public static IServiceCollection AddConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
            => services
                .Configure<SubmissionExecutionConfig>(configuration.GetSection(nameof(SubmissionExecutionConfig)));
    }
}