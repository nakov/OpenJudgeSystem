namespace OJS.Services.Infrastructure.Cache.Implementations;

using System;
using System.IO;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.Extensions.Caching.Distributed;
using OJS.Common.Extensions.Strings;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.ResilienceStrategies;
using StackExchange.Redis;
using static OJS.Services.Infrastructure.Constants.ResilienceStrategyConstants.RedisCircuitBreakerOperations;

public class CacheService : ICacheService
{
    private readonly IDistributedCache cache;
    private readonly IResilienceStrategiesService resilienceStrategiesService;
    private readonly IDatesService datesService;
    private readonly IConnectionMultiplexer redisConnection;

    public CacheService(
        IDistributedCache cache,
        IResilienceStrategiesService resilienceStrategiesService,
        IDatesService datesService,
        IConnectionMultiplexer redisConnection)
    {
        this.cache = cache;
        this.resilienceStrategiesService = resilienceStrategiesService;
        this.datesService = datesService;
        this.redisConnection = redisConnection;
    }

    public async Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration)
        => await this.resilienceStrategiesService.ExecuteRedisWithCircuitBreaker(
            async (_) =>
            {
                this.CheckRedisConnection();

                await this.VerifyValueInCache(
                    cacheId,
                    getItemCallback,
                    absoluteExpiration);

                return ParseValue<T>((await this.cache.GetAsync(cacheId))!);
            },
            getItemCallback,
            string.Format(null, ResilienceStrategyConstants.RedisCircuitBreakerOperations.GetItem, cacheId));

    public Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback)
        => this.GetItem(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

    public Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
        => this.GetItem(cacheId, getItemCallback, this.datesService.GetAbsoluteExpirationBySeconds(cacheSeconds));

    public async Task Remove(string cacheId)
        => await this.resilienceStrategiesService.ExecuteRedisWithCircuitBreaker(
            async (_) =>
            {
                this.CheckRedisConnection();

                await this.cache.RemoveAsync(cacheId);
                return Task.CompletedTask;
            },
            () => Task.FromResult(Task.CompletedTask),
            string.Format(null, RemoveItem, cacheId));

    private static T ParseValue<T>(byte[] valueAsByteArray)
        => new StreamReader(new MemoryStream(valueAsByteArray))
            .ReadToEnd()
            .FromJson<T>();

    private static byte[] ParseValue<T>(T obj)
        => obj!
            .ToJson()
            .ToByteArray();

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

    private void CheckRedisConnection()
    {
        if (this.redisConnection is not { IsConnecting: false, IsConnected: true })
        {
            throw new RedisConnectionException(ConnectionFailureType.UnableToConnect, "Connection to Redis failed. Please check if the Redis server is running and accessible.");
        }
    }
}