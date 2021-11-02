namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Common.Extensions;
    using OJS.Common.Extensions.Strings;
    using OJS.Common.Utils;
    using OJS.Services.Common.Data.Infrastructure;
    using OJS.Services.Common.Data.Infrastructure.Implementations;
    using OJS.Services.Infrastructure;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using static OJS.Common.GlobalConstants.Assemblies;

    public static class ServiceCollectionExtensions
    {
        private static readonly Type ServiceType = typeof(IService);
        private static readonly Type ScopedServiceType = typeof(IScopedService);
        private static readonly Type SingletonServiceType = typeof(ISingletonService);

        public static IServiceCollection AddWebServer<TStartup>(
            this IServiceCollection services,
            IConfiguration configuration,
            params string[] projectNames)
        {
            var currentProjectName = typeof(TStartup).GetProjectName();
            if (projectNames == null || !projectNames.Any())
            {
                projectNames = new[] { currentProjectName };
            }

            services
                .AddAutoMapperConfigurations<TStartup>()
                .AddWebServerServices(projectNames)
                .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie();

            return services;
        }

        public static IServiceCollection AddIdentityDatabase<TDbContext, TIdentityUser>(
            this IServiceCollection services,
            string connectionString,
            IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes = null)
            where TDbContext : DbContext
            where TIdentityUser : IdentityUser
        {
            services
                .AddScoped<DbContext, TDbContext>()
                .AddGlobalQueryFilterTypes(globalQueryFilterTypes)
                .AddDbContext<TDbContext>(options => options
                    .UseSqlServer(connectionString))
                .ApplyMigrations<TDbContext>()
                .AddTransient<ITransactionsProvider, TransactionsProvider<TDbContext>>();

            services
                .AddIdentity<TIdentityUser, IdentityRole>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DbContext>();

            return services;
        }

        private static IServiceCollection AddWebServerServices(
            this IServiceCollection services,
            params string[] projectNames)
            => services
                .AddFrom(projectNames
                    .Select(projectName => new[]
                    {
                        string.Format(DataServices, projectName),
                        string.Format(BusinessServices, projectName),
                    })
                    .SelectMany(x => x)
                    .Concat(new []
                    {
                        CommonDataServices,
                        CommonBusinessServices,
                        InfrastructureServices,
                    })
                    .ToArray())
                .AddTransient(typeof(IDataService<>), typeof(DataService<>));

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
            var assemblies = typeof(TStartup).Assembly
                 .GetAllReferencedAssembliesWhereFullNameMatchesPatterns(ModelsRegexPattern)
                 .ToArray();

             return services
                 .AddAutoMapper(assemblies);
        }

        private static Type GetInterfaceOf(Type type)
            => type.GetInterface($"I{type.Name}");
    }
}