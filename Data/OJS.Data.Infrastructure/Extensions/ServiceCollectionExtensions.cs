namespace OJS.Data.Infrastructure.Extensions
{
    using System.Collections.Generic;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Utils;
    using OJS.Data.Infrastructure.Implementations;
    using OJS.Data.Infrastructure.Enumerations;

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddGlobalQueryFilterTypes(
            this IServiceCollection services,
            IEnumerable<GlobalQueryFilterType>? globalQueryFilterTypes)
            => services
                .AddSingleton<IGlobalQueryFilterTypesCache>(
                    new GlobalQueryFilterTypesCache(
                        globalQueryFilterTypes ?? EnumUtils.GetValuesFrom<GlobalQueryFilterType>()));

        public static IServiceCollection AddTransactionsProvider<TDbContext>(this IServiceCollection services)
            where TDbContext : DbContext
            => services.AddTransient<ITransactionsProvider, TransactionsProvider<TDbContext>>();
    }
}