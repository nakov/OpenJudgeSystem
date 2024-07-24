namespace OJS.Services.Infrastructure.ResilienceStrategies.Implementations;

using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Configurations;
using OJS.Services.Infrastructure.Emails;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.ResilienceStrategies;
using Polly;
using Polly.CircuitBreaker;
using Polly.Registry;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;
using static OJS.Services.Infrastructure.Constants.ResilienceStrategyConstants.Common;

public class ResilienceStrategiesService : IResilienceStrategiesService
{
    private readonly int memoryCacheExpirationInSeconds = 10 * 60;
    private readonly IMemoryCache memoryCache;
    private readonly IDatesService datesService;
    private readonly IEmailService emailService;
    private readonly IConnectionMultiplexer redisConnection;
    private readonly EmailServiceConfig emailConfig;
    private readonly ResiliencePipeline circuitBreaker;

    public ResilienceStrategiesService(
        IMemoryCache memoryCache,
        IDatesService datesService,
        IEmailService emailService,
        IOptions<EmailServiceConfig> emailConfig,
        IConnectionMultiplexer redisConnection,
        ResiliencePipelineProvider<string> pipelineProvider)
    {
        this.memoryCache = memoryCache;
        this.datesService = datesService;
        this.emailService = emailService;
        this.redisConnection = redisConnection;
        this.emailConfig = emailConfig.Value;
        this.circuitBreaker = pipelineProvider.GetPipeline("RedisCircuitBreaker");
    }

    public async Task<T> ExecuteWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        string operationKey)
        => await ExecuteWithResilienceContext(async (context) =>
        {
            context.Properties.Set(new ResiliencePropertyKey<string>(OperationKey), operationKey);

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
            this.datesService.GetAbsoluteExpirationBySeconds(this.memoryCacheExpirationInSeconds));

        return true;
    }
}