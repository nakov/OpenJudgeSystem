namespace OJS.Services.Infrastructure.Cache.Implementations;

using System;
using System.IO;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.Extensions.Caching.Distributed;
using OJS.Common.Extensions.Strings;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.ResilienceStrategies;
using static OJS.Services.Infrastructure.Constants.ResilienceStrategyConstants.RedisCircuitBreakerOperations;

public class CacheService : ICacheService
{
    private readonly IDistributedCache cache;
    private readonly IResilienceStrategiesService resilienceStrategiesService;
    private readonly IDatesService datesService;

    public CacheService(
        IDistributedCache cache,
        IResilienceStrategiesService resilienceStrategiesService,
        IDatesService datesService)
    {
        this.cache = cache;
        this.resilienceStrategiesService = resilienceStrategiesService;
        this.datesService = datesService;
    }

    public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration)
        => await this.resilienceStrategiesService.ExecuteRedisWithCircuitBreaker(
            async (_) =>
            {
                var value = await this.cache.GetAsync(cacheId);
                if (value is not null)
                {
                    return ParseValue<T>(value);
                }

                var options = new DistributedCacheEntryOptions()
                    .SetAbsoluteExpiration(absoluteExpiration);

                var result = await getItemCallback();

                await this.cache.SetAsync(
                    cacheId,
                    ParseValue(result),
                    options);

                return result;
            },
            getItemCallback,
            string.Format(GetItem, cacheId));

    public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback)
        => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

    public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
        => this.Get(cacheId, getItemCallback, this.datesService.GetAbsoluteExpirationBySeconds(cacheSeconds));

    public async Task Remove(string cacheId)
        => await this.resilienceStrategiesService.ExecuteRedisWithCircuitBreaker(
            async (_) =>
            {
                await this.cache.RemoveAsync(cacheId);
                return Task.CompletedTask;
            },
            () => Task.FromResult(Task.CompletedTask),
            string.Format(RemoveItem, cacheId));

    private static T ParseValue<T>(byte[] valueAsByteArray)
        => new StreamReader(new MemoryStream(valueAsByteArray))
            .ReadToEnd()
            .FromJson<T>();

    private static byte[] ParseValue<T>(T obj)
        => obj!
            .ToJson()
            .ToByteArray();
}