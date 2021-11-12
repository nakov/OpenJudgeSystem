namespace OJS.Servers.Infrastructure.Extensions
{
    using AutoMapper;
    using Hangfire;
    using Hangfire.SqlServer;
    using Microsoft.AspNetCore.DataProtection;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Net.Http.Headers;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Common.Extensions;
    using OJS.Common.Extensions.Strings;
    using OJS.Common.Utils;
    using OJS.Services.Common.Data.Infrastructure;
    using OJS.Services.Common.Data.Infrastructure.Implementations;
    using OJS.Services.Infrastructure;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Infrastructure.HttpClients.Implementations;
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
                .AddScoped<DbContext, TDbContext>()
                .AddGlobalQueryFilterTypes(globalQueryFilterTypes)
                .AddDbContext<TDbContext>()
                .ApplyMigrations<TDbContext>()
                .AddTransient<ITransactionsProvider, TransactionsProvider<TDbContext>>();

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

        private static IServiceCollection ApplyMigrations<TDbContext>(this IServiceCollection services)
            where TDbContext : DbContext
        {
            var scopeFactory = services
                .BuildServiceProvider()
                .GetRequiredService<IServiceScopeFactory>();

            using var scope = scopeFactory.CreateScope();
            using var dbContext = scope.ServiceProvider.GetRequiredService<TDbContext>();
            dbContext.Database.Migrate();

            return services;
        }

        private static IServiceCollection AddGlobalQueryFilterTypes(
            this IServiceCollection services,
            IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes)
            => services
                .AddSingleton<IGlobalQueryFilterTypesCache>(
                    new GlobalQueryFilterTypesCache(
                        globalQueryFilterTypes ?? EnumUtils.GetValuesFrom<GlobalQueryFilterType>()));

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
                .Where(t => GetInterfaceOf(t) != null)
                .Select(t => new
                {
                    Implementation = t,
                    Service = t.IsGenericTypeDefinition
                        ? GetInterfaceOf(t).GetGenericTypeDefinition()
                        : GetInterfaceOf(t),
                })
                .ForEach(s =>
                {
                    if (s.Service == null)
                    {
                        throw new InvalidOperationException(
                            $"Service {s.Implementation.Namespace} does not have corresponding interface");
                    }

                    if (SingletonServiceType.IsAssignableFrom(s.Service))
                    {
                        services.AddSingleton(s.Service, s.Implementation);
                    }
                    else if (ScopedServiceType.IsAssignableFrom(s.Service))
                    {
                        services.AddScoped(s.Service, s.Implementation);
                    }
                    else
                    {
                        services.AddTransient(s.Service, s.Implementation);
                    }
                });

            return services;
        }

        private static IServiceCollection AddAutoMapperConfigurations<TStartup>(this IServiceCollection services)
        {
            var mappingAssemblies = typeof(TStartup).Assembly
                 .GetAllReferencedAssembliesWhereFullNameMatchesPatterns(ModelsRegexPattern)
                 .ToArray();

            var configuration = new MapperConfiguration(config => config.RegisterMappingsFrom(mappingAssemblies));

            var mapper = new Mapper(configuration);
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
    }
}