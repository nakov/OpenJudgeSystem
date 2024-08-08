namespace OJS.Servers.Administration.Extensions;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Exceptions;
using OJS.Data;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Middleware;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Configurations;
using OJS.SignalR.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using static OJS.Common.GlobalConstants.BackgroundJobs;
using ApplicationConfig = OJS.Services.Administration.Models.ApplicationConfig;

internal static class ServiceCollectionExtensions
{
    private const string AppName = "Administration";

    public static void ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddGridServices()
            .AddValidators()
            .AddWebServer<Program>(configuration)
            .AddTransient(typeof(IDataService<>), typeof(AdministrationDataService<>))
            .AddTransient<AdministrationExceptionMiddleware>()
            .AddHttpContextServices()
            .AddHangfireServer(configuration, AppName, new[] { AdministrationQueueName })
            .AddMessageQueue<Program>(configuration)
            .ConfigureGlobalDateFormat()
            .ConfigureCorsPolicy(configuration)
            .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(configuration)
            .AddMemoryCache()
            .AddDistributedCaching(configuration)
            .RegisterSignalR()
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<ApplicationUrlsConfig>()
            .AddOptionsWithValidation<EmailServiceConfig>()
            .AddControllers()
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errorsList = new List<ExceptionResponseModel>();
                    var modelStateErrors = actionContext.ModelState
                        .Where(ms => ms.Value!.Errors.Count > 0).ToList();
                    foreach (var modelStateError in modelStateErrors)
                    {
                        var error = new ExceptionResponseModel
                        {
                            Name = modelStateError.Key,
                            Message =
                                $@"Error in {modelStateError.Key.Replace("$.", string.Empty) // Remove "$."
                                    .Replace("[", string.Empty)
                                    .Replace("]", string.Empty)
                                    .Replace(".", " > ")
                                    .Trim()}: {modelStateError.Value!.Errors[0].ErrorMessage}",
                        };
                        errorsList.Add(error);
                    }

                    return new BadRequestObjectResult(errorsList);
                };
            })
            .AddJsonOptions(jo => jo.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

    private static IServiceCollection AddValidators(this IServiceCollection services)
        => services
            .AddValidatorsFromAssemblyContaining(typeof(BaseValidator<>))
            .AddValidatorsFromAssemblyContaining<ContestAdministrationModelValidator>();

    private static IServiceCollection AddGridServices(this IServiceCollection services)
        => services
            .AddTransient(typeof(IGridDataService<>), typeof(GridDataService<>));
}