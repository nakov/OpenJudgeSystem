namespace OJS.Servers.Infrastructure.Extensions
{
    using AutoMapper;
    using FluentExtensions.Extensions;
    using Hangfire;
    using Hangfire.SqlServer;
    using Microsoft.AspNetCore.DataProtection;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Net.Http.Headers;
    using OJS.Common.Enumerations;
    using OJS.Common.Extensions;
    using OJS.Common.Extensions.Strings;
    using OJS.Common.Utils;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Infrastructure.HttpClients.Implementations;
    using SoftUni.Data.Infrastructure.Enumerations;
    using SoftUni.Data.Infrastructure.Extensions;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.Http;
    using static OJS.Common.GlobalConstants;
    using static OJS.Common.GlobalConstants.Assemblies;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Servers.Infrastructure.ServerConstants;

    public static class ServiceCollectionExtensions
    {
        private static readonly Type ServiceType = typeof(IService);
        private static readonly Type ScopedServiceType = typeof(IScopedService);
        private static readonly Type SingletonServiceType = typeof(ISingletonService);

        public static IServiceCollection AddWebServer<TStartup>(
            this IServiceCollection services,
            params string[] projectNames)
        {
            var currentProjectName = typeof(TStartup).GetProjectName();
            if (projectNames == null || !projectNames.Any())
            {
                projectNames = new[] { currentProjectName };
            }

            return services
                .AddAutoMapperConfigurations<TStartup>()
                .AddWebServerServices(projectNames)
                .AddAuthenticationServices();
        }

        public static IServiceCollection AddIdentityDatabase<TDbContext, TIdentityUser>(
            this IServiceCollection services,
            IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes = null)
            where TDbContext : DbContext
            where TIdentityUser : IdentityUser
        {
            services
                .AddSqlDatabase<TDbContext>(globalQueryFilterTypes);

            services
                .AddIdentity<TIdentityUser, IdentityRole>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DbContext>();

            return services;
        }

        public static IServiceCollection AddHangfireServer(this IServiceCollection services, ApplicationName app)
        {
            var connectionString = EnvironmentUtils.GetApplicationConnectionString(app);

            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true,
                }));

            services.AddHangfireServer();

            return services;
        }

        private static IServiceCollection AddWebServerServices(
            this IServiceCollection services,
            params string[] projectNames)
        {
            services
                .AddFrom(projectNames
                    .Select(projectName => new[]
                    {
                        string.Format(DataServices, projectName),
                        string.Format(BusinessServices, projectName),
                    })
                    .SelectMany(x => x)
                    .Concat(new[]
                    {
                        CommonDataServices,
                        CommonServices,
                        InfrastructureServices,
                    })
                    .ToArray())
                .AddTransient(typeof(IDataService<>), typeof(DataService<>));

            services.AddHttpClient<IHttpClientService, HttpClientService>(ConfigureHttpClient);
            services.AddHttpClient<ISulsPlatformHttpClientService, SulsPlatformHttpClientService>(ConfigureHttpClient);

            return services;
        }

        private static IServiceCollection AddFrom(
            this IServiceCollection services,
            params string[] assemblyNames)
        {
            assemblyNames
                .GetExportedTypes()
                .Where(t => t.IsClass && !t.IsAbstract)
                .Where(t =>
                    ServiceType.IsAssignableFrom(t) ||
                    ScopedServiceType.IsAssignableFrom(t) ||
                    SingletonServiceType.IsAssignableFrom(t))
                .Select(t => new
                {
                    Implementation = t,
                    Service = t.IsGenericTypeDefinition
                        ? GetInterfaceOf(t).GetGenericTypeDefinition()
                        : GetInterfaceOf(t),
                })
                .ForEach(s => services.RegisterService(s.Implementation, s.Service));

            return services;
        }

        private static IServiceCollection AddAutoMapperConfigurations<TStartup>(this IServiceCollection services)
        {
            var mappingAssemblies = typeof(TStartup).Assembly
                 .GetAllReferencedAssembliesWhereFullNameMatchesPatterns(ModelsRegexPattern)
                 .ToArray();

            var configuration = new MapperConfiguration(config =>
            {
                config.RegisterMappingsFrom(mappingAssemblies);
            });

            configuration.AssertConfigurationIsValid();

            var mapper = configuration.CreateMapper();
            services.AddSingleton(mapper);

            return services;
        }

        private static IServiceCollection AddAuthenticationServices(this IServiceCollection services)
        {
            var keysDirectory = new DirectoryInfo(EnvironmentUtils.GetByKey(PathToCommonKeyRingFolderKey));

            services
                .AddDataProtection()
                .PersistKeysToFileSystem(keysDirectory)
                .SetApplicationName(ApplicationFullName);

            services
                .AddAuthentication(Authentication.SharedCookiesScheme)
                .AddCookie(Authentication.SharedCookiesScheme, opt =>
                {
                    opt.Cookie.Name = Authentication.SharedCookieName;
                });

            return services;
        }

        private static Type GetInterfaceOf(Type type)
            => type.GetInterface($"I{type.Name}");

        private static void ConfigureHttpClient(HttpClient client)
            => client.DefaultRequestHeaders.Add(HeaderNames.Accept, MimeTypes.ApplicationJson);

        private static void RegisterService(this IServiceCollection services, Type implementation, Type service = null)
        {
            if (implementation == null)
            {
                throw new ArgumentException("Cannot register service with no implementation");
            }

            if (SingletonServiceType.IsAssignableFrom(implementation))
            {
                if (service == null)
                {
                    services.AddSingleton(implementation);
                }
                else
                {
                    services.AddSingleton(service, implementation);
                }
            }
            else if (ScopedServiceType.IsAssignableFrom(implementation))
            {
                if (service == null)
                {
                    services.AddScoped(implementation);
                }
                else
                {
                    services.AddScoped(service, implementation);
                }
            }
            else
            {
                if (service == null)
                {
                    services.AddTransient(implementation);
                }
                else
                {
                    services.AddTransient(service, implementation);
                }
            }
        }
    }
}