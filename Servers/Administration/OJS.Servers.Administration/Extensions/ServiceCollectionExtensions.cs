namespace OJS.Servers.Administration.Extensions;

using System.Linq;
using AutoCrudAdmin.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Enumerations;
using OJS.Data;
using OJS.Data.Models.Users;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Models.Configurations;
using SoftUni.Data.Infrastructure.Enumerations;
using ApplicationConfig = OJS.Services.Administration.Models.ApplicationConfig;
using System.Text.Json.Serialization;

internal static class ServiceCollectionExtensions
{
    private const ApplicationName AppName = ApplicationName.Administration;

    public static void ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddWebServer<Program>(configuration)
            .AddHttpContextServices()
            .AddHangfireServer(configuration, AppName)
            .AddMessageQueue<Program>(configuration)
            .ConfigureGlobalDateFormat()
            .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(
                configuration,
                Enumerable.Empty<GlobalQueryFilterType>())
            .AddMemoryCache()
            .AddDistributedCaching(configuration)
            .AddSoftUniJudgeCommonServices()
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<ApplicationUrlsConfig>()
            .AddOptionsWithValidation<EmailServiceConfig>()
            .UseAutoCrudAdmin()
            .AddControllersWithViews()
            .AddJsonOptions(jo => jo.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
}
