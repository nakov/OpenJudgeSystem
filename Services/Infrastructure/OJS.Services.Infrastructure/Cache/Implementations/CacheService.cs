namespace OJS.Services.Infrastructure.Cache.Implementations;

using OJS.Services.Infrastructure.Exceptions;
using System;
using System.IO;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using OJS.Common.Extensions.Strings;
using OJS.Services.Infrastructure.Configurations;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Emails;
using Polly;
using Polly.CircuitBreaker;
using Polly.Registry;
using StackExchange.Redis;

public class CacheService : ICacheService
{
    private readonly int memoryCacheExpirationInSeconds = 10 * 60;
    private readonly IDistributedCache cache;
    private readonly IDatesService dates;
    private readonly IMemoryCache memoryCache;
    private readonly IEmailService emailService;
    private readonly EmailServiceConfig emailConfig;
    private readonly IConnectionMultiplexer redisConnection;
    private readonly ResiliencePipeline circuitBreaker;

    public CacheService(
        IDistributedCache cache,
        IDatesService dates,
        IMemoryCache memoryCache,
        IEmailService emailService,
        IOptions<EmailServiceConfig> emailConfig,
        IConnectionMultiplexer redisConnection,
        ResiliencePipelineProvider<string> pipelineProvider)
    {
        this.cache = cache;
        this.dates = dates;
        this.memoryCache = memoryCache;
        this.emailService = emailService;
        this.redisConnection = redisConnection;
        this.emailConfig = emailConfig.Value;
        this.circuitBreaker = pipelineProvider.GetPipeline("RedisCircuitBreaker");
    }

    public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration)
        => await this.ExecuteWithCircuitBreaker(
            async (_) =>
            {
                await this.VerifyValueInCache(
                    cacheId,
                    getItemCallback,
                    absoluteExpiration);

                return ParseValue<T>((await this.cache.GetAsync(cacheId))!);
            },
            getItemCallback,
            $"Get_{cacheId}");

    public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback)
        => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

    public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
        => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

    public async Task Remove(string cacheId)
        => await this.ExecuteWithCircuitBreaker(
            async (_) =>
            {
                await this.cache.RemoveAsync(cacheId);
                return Task.CompletedTask;
            },
            () => Task.FromResult(Task.CompletedTask),
            $"Remove_{cacheId}");

    private static async Task<T> ExecuteWithResilienceContext<T>(Func<ResilienceContext, Task<T>> action)
    {
        var context = ResilienceContextPool.Shared.Get();
        try
        {
            return await action(context);
        }
        finally
        {
            ResilienceContextPool.Shared.Return(context);
        }
    }

    private static T ParseValue<T>(byte[] valueAsByteArray)
        => new StreamReader(new MemoryStream(valueAsByteArray))
            .ReadToEnd()
            .FromJson<T>();

    private static byte[] ParseValue<T>(T obj)
        => obj!
            .ToJson()
            .ToByteArray();

    private async Task<T> ExecuteWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        string operationKey)
        => await ExecuteWithResilienceContext(async (context) =>
        {
            context.Properties.Set(new ResiliencePropertyKey<string>("OperationKey"), operationKey);

            var outcome = await this.circuitBreaker.ExecuteOutcomeAsync(
                async (_, _) =>
                {
                    if (!this.IsRedisConnected())
                    {
                        throw new RedisConnectionException(ConnectionFailureType.UnableToConnect, "Connection to Redis failed. Please check if the Redis server is running and accessible.");
                    }

                    return Outcome.FromResult(await action(context));
                },
                context,
                operationKey);

            if (outcome.Exception is BrokenCircuitException)
            {
                return await fallbackAction();
            }

            if (outcome.Exception is RedisConnectionException)
            {
                if (this.ShouldSendExceptionEmail(nameof(RedisConnectionException), outcome.Exception.Message))
                {
                    await this.SendEmailAsync(outcome.Exception);
                }

                // If the circuit is not yet open, we want to display an error message to the user. For example: the contest's compete / practice page.
                throw new CircuitBreakerNotOpenException("Temporary connectivity issue with the data server. The system is attempting to recover. Please try again in a few moments.");
            }

            if (outcome.Exception is RedisCommandException)
            {
                if (this.ShouldSendExceptionEmail(nameof(RedisCommandException), outcome.Exception.Message))
                {
                    await this.SendEmailAsync(outcome.Exception);
                }
            }

            if (outcome.Exception is not null)
            {
                throw outcome.Exception;
            }

            return outcome.Result!;
        });

    private DateTime GetAbsoluteExpirationByCacheSeconds(int cacheSeconds)
        => this.dates
            .GetUtcNow()
            .AddSeconds(cacheSeconds);

    private async Task VerifyValueInCache<T>(
        string cacheId,
        Func<Task<T>> getItemCallback,
        DateTime absoluteExpiration)
    {
        var value = await this.cache.GetAsync(cacheId);
        if (value.IsNull())
        {
            var options = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(absoluteExpiration);

            var result = await getItemCallback();
            await this.cache.SetAsync(
                cacheId,
                ParseValue(result),
                options);
        }
    }

    private bool IsRedisConnected() => this.redisConnection is { IsConnecting: false, IsConnected: true };

    private async Task SendEmailAsync(Exception exception)
    {
        var exceptionName = exception.GetType().Name;
        if (this.ShouldSendExceptionEmail(exceptionName, exception.Message))
        {
            await this.emailService.SendEmailAsync(
                this.emailConfig.DevEmail,
                exceptionName,
                exception.Message);
        }
    }

    private bool ShouldSendExceptionEmail(string exceptionName, string exceptionValue)
    {
        if (this.memoryCache.TryGetValue(exceptionName, out string? cacheValue))
        {
            return false;
        }

        this.memoryCache.Set(
            exceptionName,
            exceptionValue,
            this.GetAbsoluteExpirationByCacheSeconds(this.memoryCacheExpirationInSeconds));

        return true;
    }
}