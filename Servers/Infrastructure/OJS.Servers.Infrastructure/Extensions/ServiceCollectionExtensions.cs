namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Common.Extensions;
    using OJS.Common.Extensions.Strings;
    using OJS.Common.Utils;
    using OJS.Services.Data.Infrastructure;
    using OJS.Services.Data.Infrastructure.Implementations;
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
            IConfiguration configuration)
            => services
                .AddAutomapperConfigurations<TStartup>()
                .AddWebServerServices();

        public static IServiceCollection AddDatabase<TDbContext>(
            this IServiceCollection services,
            string connectionString,
            IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes = null)
            where TDbContext : DbContext
            => services
                .AddScoped<DbContext, TDbContext>()
                .AddGlobalQueryFilterTypes(globalQueryFilterTypes)
                .AddDbContext<TDbContext>(options => options
                    .UseSqlServer(connectionString))
                .ApplyMigrations<TDbContext>()
                .AddTransient<ITransactionsProvider, TransactionsProvider<TDbContext>>();

        private static IServiceCollection AddWebServerServices(
            this IServiceCollection services)
            => services
                .AddFrom(
                    DataServices,
                    BusinessServices,
                    InfrastructureServices);

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

        private static IServiceCollection AddAutomapperConfigurations<TStartup>(this IServiceCollection services)
        {
            var assemblies = typeof(TStartup).Assembly
                 .GetAllReferencedAssembliesWhereFullNameMatchesPattern("^OJS\\.")
                 .ToArray();

             return services
                 .AddAutoMapper(assemblies);
        }

        private static Type GetInterfaceOf(Type type)
            => type.GetInterface($"I{type.Name}");
    }
}