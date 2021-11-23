namespace OJS.Servers.Infrastructure.Extensions
{
    using Hangfire;
    using Hangfire.SqlServer;
    using Microsoft.AspNetCore.DataProtection;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Net.Http.Headers;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Infrastructure.HttpClients.Implementations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.Data.Infrastructure.Enumerations;
    using SoftUni.Data.Infrastructure.Extensions;
    using SoftUni.Services.Infrastructure.Extensions;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Http;
    using static OJS.Common.GlobalConstants;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Servers.Infrastructure.ServerConstants;

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddWebServer<TStartup>(this IServiceCollection services)
            => services
                .AddAutoMapperConfigurations<TStartup>()
                .AddWebServerServices<TStartup>()
                .AddAuthenticationServices();

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

        private static IServiceCollection AddWebServerServices<TStartUp>(this IServiceCollection services)
        {
            services
                .AddConventionServices<TStartUp>()
                .AddTransient(typeof(IDataService<>), typeof(DataService<>));

            services.AddHttpClient<IHttpClientService, HttpClientService>(ConfigureHttpClient);
            services.AddHttpClient<ISulsPlatformHttpClientService, SulsPlatformHttpClientService>(ConfigureHttpClient);
            services.AddHttpClient<IDistributorHttpClientService, DistributorHttpClientService>(ConfigureHttpClient);

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

        private static void ConfigureHttpClient(HttpClient client)
            => client.DefaultRequestHeaders.Add(HeaderNames.Accept, MimeTypes.ApplicationJson);
    }
}