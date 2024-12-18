namespace OJS.Services.Infrastructure.ResilienceStrategies;

using Polly;
using System;
using System.Threading.Tasks;

public interface IResilienceStrategiesService
{
    Task<T> ExecuteRedisWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        string operationKey);
}