namespace OJS.Servers.Infrastructure.Extensions
{
    using OJS.Servers.Infrastructure.Configurations;
    using Hangfire;
    using Hangfire.SqlServer;
    using OJS.Servers.Infrastructure.Listeners;
    using MassTransit;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.DataProtection;
    using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Server.Kestrel.Core;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Net.Http.Headers;
    using Microsoft.OpenApi.Models;
    using OJS.Common;
    using OJS.Data;
    using OJS.Data.Implementations;
    using OJS.Servers.Infrastructure.Filters;
    using OJS.Services.Common;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Common.Implementations;
    using OJS.Services.Infrastructure.Cache;
    using OJS.Services.Infrastructure.Cache.Implementations;
    using OJS.Services.Infrastructure.Configurations;
    using OJS.Services.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Infrastructure.HttpClients.Implementations;
    using Polly;
    using Polly.CircuitBreaker;
    using Polly.Retry;
    using Polly.Telemetry;
    using Serilog.Extensions.Logging;
    using StackExchange.Redis;
    using System;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Reflection;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants;
    using static OJS.Common.GlobalConstants.FileExtensions;

    public static class ServiceCollectionExtensions
    {
        private const string DefaultDbConnectionName = "DefaultConnection";

        public static IServiceCollection AddWebServer<TStartup>(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services
                .AddAutoMapperConfigurations<TStartup>()
                .AddWebServerServices<TStartup>()
                .AddOptionsWithValidation<ApplicationConfig>()
                .AddOptionsWithValidation<HealthCheckConfig>()
                .AddOptionsWithValidation<CircuitBreakerResilienceStrategyConfig>()
                .AddOptionsWithValidation<RetryResilienceStrategyConfig>();

            var maxRequestLimit = configuration.GetSectionWithValidation<HttpConfig>().MaxRequestSizeLimit;
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = maxRequestLimit;
            });

            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = maxRequestLimit;
            });

            services.AddSingleton<ValidateApiKeyAttribute>();

            return services;
        }

        /// <summary>
        /// Adds identity database and authentication services to the service collection.
        /// </summary>
        /// <param name="services">The service collection.</param>
        /// <param name="configuration">The configuration.</param>
        public static IServiceCollection AddIdentityDatabase<TDbContext, TIdentityUser, TIdentityRole,
            TIdentityUserRole>(
            this IServiceCollection services,
            IConfiguration configuration)
            where TDbContext : DbContext, IDataProtectionKeyContext
            where TIdentityUser : IdentityUser
            where TIdentityRole : IdentityRole
            where TIdentityUserRole : IdentityUserRole<string>, new()
        {
            services
                .AddDbContext<TDbContext>(options =>
                {
                    var connectionString = configuration.GetConnectionString(DefaultDbConnectionName);
                    options.UseSqlServer(connectionString);
                })
                .AddTransient<ITransactionsProvider, TransactionsProvider<TDbContext>>();

            services
                .AddIdentity<TIdentityUser, TIdentityRole>()
                .AddRoles<TIdentityRole>()
                .AddEntityFrameworkStores<TDbContext>()
                .AddUserStore<UserStore<
                    TIdentityUser,
                    TIdentityRole,
                    TDbContext,
                    string,
                    IdentityUserClaim<string>,
                    TIdentityUserRole,
                    IdentityUserLogin<string>,
                    IdentityUserToken<string>,
                    IdentityRoleClaim<string>>>();

            var sharedAuthCookieDomain = configuration
                .GetSectionValueWithValidation<ApplicationConfig, string>(
                    nameof(ApplicationConfig.SharedAuthCookieDomain));

            services
                .ConfigureApplicationCookie(opt =>
                {
                    opt.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    opt.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
                    opt.Cookie.Domain = sharedAuthCookieDomain;
                    opt.Events.OnRedirectToAccessDenied = UnAuthorizedResponse;
                    opt.Events.OnRedirectToLogin = UnAuthorizedResponse;
                });

            // By default, the data protection API that encrypts the authentication cookie generates a unique key for each application,
            // but in order to use/decrypt the same cookie across multiple servers, we need to use the same encryption key.
            // By setting custom data protection, we can use the same key in each server configured with the same application name.
            services
                .AddDataProtection()
                .PersistKeysToDbContext<TDbContext>()
                .SetApplicationName(ApplicationFullName);

            return services;
        }

        public static IServiceCollection AddHangfireServer(
            this IServiceCollection services,
            IConfiguration configuration,
            string serverName,
            string[] queues)
        {
            var connectionString = configuration.GetConnectionString(DefaultDbConnectionName);

            services.AddHangfire(cfg => cfg
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

            services.AddHangfireServer(options =>
            {
                options.ServerName = serverName;
                options.Queues = queues;
            });

            services.AddHostedService<BackgroundJobsHostedService>();

            return services;
        }

        public static IServiceCollection AddSwaggerDocs(
            this IServiceCollection services,
            string name,
            string title,
            string version)
            => services
                .AddSwaggerGen(options =>
                {
                    options.SwaggerDoc(name, new OpenApiInfo { Title = title, Version = version, });

                    options.MapType<FileContentResult>(() => new OpenApiSchema { Type = "file", });

                    var entryAssembly = Assembly.GetEntryAssembly();
                    if (entryAssembly != null)
                    {
                        var xmlFilename = $"{entryAssembly.GetName().Name}{Xml}";
                        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
                    }
                });

        public static IServiceCollection AddDistributedCaching(
            this IServiceCollection services,
            IConfiguration configuration)
            => services.AddRedis(configuration);

        public static IServiceCollection AddMessageQueue<TStartup>(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddTransient<IPublisherService, PublisherService>();

            var consumers = typeof(TStartup).Assembly
                .GetExportedTypes()
                .Where(t => typeof(IConsumer).IsAssignableFrom(t) && t is { IsInterface: false, IsAbstract: false })
                .ToList();

            var messageQueueConfig = configuration.GetSectionWithValidation<MessageQueueConfig>();

            services.AddMassTransit(config =>
            {
                consumers.ForEach(consumer => config
                    .AddConsumer(consumer)
                    .Endpoint(endpointConfig =>
                    {
                        endpointConfig.Name = consumer.Name;
                        if (endpointConfig is IRabbitMqReceiveEndpointConfigurator configurator)
                        {
                            configurator.Durable = true;
                        }
                    }));

                config.UsingRabbitMq((context, rmq) =>
                {
                    rmq.Host(messageQueueConfig.Host, messageQueueConfig.VirtualHost, h =>
                    {
                        h.Username(messageQueueConfig.User);
                        h.Password(messageQueueConfig.Password);
                    });

                    consumers.ForEach(consumer => rmq.ReceiveEndpoint(consumer.FullName!, endpoint =>
                    {
                        if (messageQueueConfig.PrefetchCount.HasValue)
                        {
                            endpoint.PrefetchCount = messageQueueConfig.PrefetchCount.Value;
                        }

                        endpoint.UseMessageRetry(retry =>
                            retry.Interval(messageQueueConfig.RetryCount, messageQueueConfig.RetryInterval));

                        endpoint.ConfigureConsumer(context, consumer);
                    }));
                });
            });

            return services;
        }

        public static IServiceCollection AddHttpContextServices(this IServiceCollection services)
            => services
                .AddHttpContextAccessor()
                .AddTransient(s =>
                    s.GetRequiredService<IHttpContextAccessor>().HttpContext?.User ?? new ClaimsPrincipal());

        public static IServiceCollection AddOptionsWithValidation<T>(this IServiceCollection services)
            where T : BaseConfig
            => services
                .AddOptions<T>()
                .BindConfiguration(Activator.CreateInstance<T>().SectionName)
                .ValidateDataAnnotations()
                .ValidateOnStart()
                .Services;

        public static IServiceCollection ConfigureCorsPolicy(this IServiceCollection services, IConfiguration configuration) =>
        services.AddCors(options =>
        {
            options.AddPolicy(
                GlobalConstants.CorsDefaultPolicyName,
                config =>
                    config.WithOrigins(
                            configuration.GetSectionWithValidation<ApplicationUrlsConfig>().FrontEndUrl)
                        .WithExposedHeaders("Content-Disposition")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
        });

        public static IServiceCollection AddResiliencePipelines(this IServiceCollection services)
        {
            services.AddResiliencePipeline("RedisCircuitBreaker", (builder, context) =>
            {
                var circuitBreakerConfig = context.ServiceProvider.GetRequiredService<IOptions<CircuitBreakerResilienceStrategyConfig>>().Value;
                var retryConfig = context.ServiceProvider.GetRequiredService<IOptions<RetryResilienceStrategyConfig>>().Value;
                var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder.AddProvider(new SerilogLoggerProvider()));
                var logger = loggerFactory.CreateLogger<ResiliencePipeline>();

                var handleRedisExceptions = new PredicateBuilder()
                    .Handle<RedisConnectionException>()
                    .Handle<RedisCommandException>();

                var handleAllExceptions = new PredicateBuilder()
                    .Handle<Exception>();

                builder
                    .AddCircuitBreaker(new CircuitBreakerStrategyOptions
                    {
                        FailureRatio = circuitBreakerConfig.FailureRatio,
                        MinimumThroughput = circuitBreakerConfig.MinimumThroughput,
                        SamplingDuration = circuitBreakerConfig.SamplingDuration,
                        BreakDuration = circuitBreakerConfig.DurationOfBreak,
                        ShouldHandle = handleRedisExceptions,
                    })
                    .AddRetry(new RetryStrategyOptions
                    {
                        MaxRetryAttempts = retryConfig.MaxRetryAttempts,
                        Delay = retryConfig.Delay,
                        BackoffType = retryConfig.BackoffType,
                        UseJitter = retryConfig.UseJitter,
                        ShouldHandle = handleAllExceptions,
                        OnRetry = (args) =>
                        {
                          logger.LogWarning($"Retry attempt #{args.AttemptNumber}. Operation: Retry_{args.Context.Properties.GetValue(new ResiliencePropertyKey<string>("OperationKey"), string.Empty)} Result: {args.Outcome.Result ?? "No result."}, Exception: {(args.Outcome.Exception is not null ? args.Outcome.Exception.Message : "null")}, Duration: {args.Duration.Milliseconds}ms, Retry Delay: {args.RetryDelay.Milliseconds}ms");
                          return default;
                        },
                    })
                    .ConfigureTelemetry(new TelemetryOptions
                    {
                        LoggerFactory = loggerFactory,
                    })
                    .TelemetryListener = new RedisCircuitBreakerListener(logger);
            });

            return services;
        }

        private static IServiceCollection AddWebServerServices<TStartUp>(this IServiceCollection services)
        {
            services
                .AddConventionServices<TStartUp>()
                .AddTransient(typeof(IDataService<>), typeof(DataService<>));

            services.AddHttpClient<IHttpClientService, HttpClientService>(ConfigureHttpClient);
            services.AddHttpClient<ISulsPlatformHttpClientService, SulsPlatformHttpClientService>(ConfigureHttpClient);

            return services;
        }

        private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
        {
            var redisConfig = configuration.GetSectionWithValidation<RedisConfig>();

            var redisConnection = ConnectionMultiplexer.Connect(redisConfig.ConnectionString);

            services.AddSingleton<IConnectionMultiplexer>(redisConnection);
            services.AddSingleton<ICacheService, CacheService>();

            return services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConfig.ConnectionString;
                options.InstanceName = $"{redisConfig.InstanceName}:";
            });
        }

        private static void ConfigureHttpClient(HttpClient client)
            => client.DefaultRequestHeaders.Add(HeaderNames.Accept, MimeTypes.ApplicationJson);

        private static Task UnAuthorizedResponse(RedirectContext<CookieAuthenticationOptions> context)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return Task.CompletedTask;
        }
    }
}