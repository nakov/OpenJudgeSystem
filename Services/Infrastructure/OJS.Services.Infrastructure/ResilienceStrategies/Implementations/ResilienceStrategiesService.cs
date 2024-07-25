namespace OJS.Services.Infrastructure.ResilienceStrategies.Implementations;

using OJS.Services.Infrastructure.ResilienceStrategies;
using Polly;
using Polly.Registry;
using System;
using System.Threading.Tasks;
using static OJS.Services.Infrastructure.Constants.ResilienceStrategyConstants.Common;

public class ResilienceStrategiesService : IResilienceStrategiesService
{
    private readonly IRedisResilienceStrategiesService redisResilienceStrategiesService;
    private readonly ResiliencePipeline circuitBreaker;

    public ResilienceStrategiesService(
        IRedisResilienceStrategiesService redisResilienceStrategiesService,
        ResiliencePipelineProvider<string> pipelineProvider)
    {
        this.redisResilienceStrategiesService = redisResilienceStrategiesService;
        this.circuitBreaker = pipelineProvider.GetPipeline("RedisCircuitBreaker");
    }

    public Task<T> ExecuteRedisWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        string operationKey)
        => this.ExecuteWithCircuitBreaker(
            action,
            fallbackAction,
            this.redisResilienceStrategiesService.ProcessOutcome,
            operationKey);

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

    private async Task<T> ExecuteWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        Func<Func<Task<T>>, Outcome<T>, Task<T>> processOutcome,
        string operationKey)
        => await ExecuteWithResilienceContext(async (context) =>
        {
            context.Properties.Set(new ResiliencePropertyKey<string>(OperationKey), operationKey);

            var outcome = await this.circuitBreaker.ExecuteOutcomeAsync(
                async (_, _) => Outcome.FromResult(await action(context)),
                context,
                operationKey);

            return await processOutcome(fallbackAction, outcome);
        });
}