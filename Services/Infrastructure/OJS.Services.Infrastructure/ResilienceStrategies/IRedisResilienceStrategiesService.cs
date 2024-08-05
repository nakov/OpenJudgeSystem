namespace OJS.Services.Infrastructure.ResilienceStrategies;

using Polly;
using System;
using System.Threading.Tasks;

public interface IRedisResilienceStrategiesService : ISingletonService
{
    Task<T> ProcessOutcome<T>(
        Func<Task<T>> fallback,
        Outcome<T> outcome);
}