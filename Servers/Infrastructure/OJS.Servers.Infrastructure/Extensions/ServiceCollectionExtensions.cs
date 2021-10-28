namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using OJS.Services.Data.Infrastructure;
    using OJS.Services.Data.Infrastructure.Implementations;
    using System.Linq;

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDatabase<TDbContext>(
            this IServiceCollection services,
            string connectionString,
            params GlobalQueryFilterType[] filterTypes)
            where TDbContext : DbContext
            => services
                .AddScoped<DbContext, TDbContext>()
                .AddGlobalQueryFilterTypes(filterTypes)
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
            params GlobalQueryFilterType[] filterTypes)
            => services
                .AddSingleton<IGlobalQueryFilterTypesCache>(
                    new GlobalQueryFilterTypesCache(filterTypes.Any()
                        ? filterTypes
                        : EnumUtils.GetValuesFrom<GlobalQueryFilterType>()));
    }
}