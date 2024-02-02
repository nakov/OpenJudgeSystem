namespace OJS.Servers.Administration.Extensions;

using AutoCrudAdmin.Extensions;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Enumerations;
using OJS.Data;
using OJS.Data.Models.Users;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Configurations;
using SoftUni.Data.Infrastructure.Enumerations;
using System.Linq;
using System.Text.Json.Serialization;
using ApplicationConfig = OJS.Services.Administration.Models.ApplicationConfig;
using OJS.Services.Administration.Business.Participants.Validators;
using OJS.Services.Administration.Business.ProblemGroups.Validators;
using OJS.Services.Administration.Business.SubmissionTypes.Validators;
using OJS.Services.Administration.Models.Problems;

internal static class ServiceCollectionExtensions
{
    private const ApplicationName AppName = ApplicationName.Administration;

    public static void ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddGridServices()
            .AddValidators()
            .AddWebServer<Program>(configuration)
            .AddHttpContextServices()
            .AddHangfireServer(configuration, AppName)
            .AddMessageQueue<Program>(configuration)
            .ConfigureGlobalDateFormat()
            .ConfigureCorsPolicy(configuration)
            .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(
                configuration,
                Enumerable.Empty<GlobalQueryFilterType>())
            .AddMemoryCache()
            .AddDistributedCaching(configuration)
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<ApplicationUrlsConfig>()
            .AddOptionsWithValidation<EmailServiceConfig>()
            .UseAutoCrudAdmin()
            .AddControllersWithViews()
            .AddJsonOptions(jo => jo.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

    private static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<ContestAdministrationModelValidator>(ServiceLifetime.Transient);
        services.AddValidatorsFromAssemblyContaining<ProblemAdministrationModelValidator>(ServiceLifetime.Transient);
        services.AddValidatorsFromAssemblyContaining<ParticipantsAdministrationModelValidator>(ServiceLifetime.Transient);
        services.AddValidatorsFromAssemblyContaining<SubmissionTypesAdministrationModelValidator>(ServiceLifetime.Transient);
        services.AddValidatorsFromAssemblyContaining<ParticipantsAdministrationModelValidator>(ServiceLifetime.Transient);
        services.AddValidatorsFromAssemblyContaining<ProblemGroupsAdministrationModelValidator>(ServiceLifetime.Transient);
        return services;
    }

    private static IServiceCollection AddGridServices(this IServiceCollection services) =>
        services.AddTransient(typeof(IGridDataService<>), typeof(GridDataService<>));
}