namespace OJS.Services.Infrastructure.ResilienceStrategies;

using OJS.Services.Infrastructure;
using Polly;
using System;
using System.Threading.Tasks;

public interface IResilienceStrategiesService : IService
{
    Task<T> ExecuteWithCircuitBreaker<T>(
        Func<ResilienceContext, Task<T>> action,
        Func<Task<T>> fallbackAction,
        string operationKey);
}