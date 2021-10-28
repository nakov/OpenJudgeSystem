namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using OJS.Services.Data.Infrastructure;
    using OJS.Services.Data.Infrastructure.Implementations;
    using System.Collections.Generic;

    public static class ServiceCollectionExtensions
    {
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
    }
}