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
using OJS.Services.Common.Models.Configurations;
using SoftUni.Data.Infrastructure.Enumerations;
using System.Linq;
using System.Text.Json.Serialization;
using ApplicationConfig = OJS.Services.Administration.Models.ApplicationConfig;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Validation;

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
        => services
            .AddValidatorsFromAssemblyContaining(typeof(BaseValidator<>))
            .AddValidatorsFromAssemblyContaining<ContestAdministrationModelValidator>();

    private static IServiceCollection AddGridServices(this IServiceCollection services)
        => services
            .AddTransient(typeof(IGridDataService<>), typeof(GridDataService<>));
}