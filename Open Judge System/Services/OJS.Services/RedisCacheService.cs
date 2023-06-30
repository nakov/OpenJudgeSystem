using Newtonsoft.Json;
using OJS.Services.Cache;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace OJS.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDatabase redisCache;

        public RedisCacheService(IDatabase redisCache)
        {
            this.redisCache = redisCache;
        }

        public T Get<T>(string cacheId)
        {
            var valueAsString = this.redisCache.StringGet(cacheId);

            if (valueAsString.IsNull)
            {
                return default(T);

            }

            return JsonConvert.DeserializeObject<T>(valueAsString);
        }

        public async Task<T> GetAsync<T>(string cacheId)
        {
            var valueAsString = await this.redisCache.StringGetAsync(cacheId);

            if (valueAsString.IsNull)
            {
                return default(T);

            }

            return JsonConvert.DeserializeObject<T>(valueAsString);
        }

        public T GetOrSet<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan? expiration)
        {
            this.VerifyValueInCache<T>(cacheId, getItemCallback, expiration).Wait();

            return this.Get<T>(cacheId);
        }

        public async Task<T> GetOrSetAsync<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan? expiration)
        {
            await this.VerifyValueInCache<T>(cacheId, getItemCallback, expiration);

            return await this.GetAsync<T>(cacheId);
        }

        public void Set<T>(string cacheId, T value, TimeSpan? expiration)
        {
            string serializedObject = JsonConvert.SerializeObject(value);

            if (expiration.HasValue)
            {
                    this.redisCache.StringSet(cacheId, serializedObject, expiration);
            }
            else
            {
                this.redisCache.StringSet(cacheId, serializedObject);
            }
        }

        public async Task SetAsync<T>(string cacheId, T value, TimeSpan? expiration)
        {
            string serializedObject = JsonConvert.SerializeObject(value);

            if (expiration.HasValue)
            {
                await this.redisCache.StringSetAsync(cacheId, serializedObject, expiration);
            }
            else
            {
                await this.redisCache.StringSetAsync(cacheId, serializedObject);
            }
        }

        public void Remove(string cacheId) => this.redisCache.KeyDelete(cacheId);

        public Task RemoveAsync(string cacheId) => this.redisCache.KeyDeleteAsync(cacheId);

        private async Task VerifyValueInCache<T>(
            string cacheId,
            Func<Task<T>> getItemCallback,
            TimeSpan? expiration)
        {
            var value = await this.redisCache.StringGetAsync(cacheId);
            if (value.IsNull)
            {
                var result = await getItemCallback();

                var parsedValue = JsonConvert.SerializeObject(result);
                await this.redisCache.StringSetAsync(
                    cacheId,
                    parsedValue,
                    expiration);
            }
        }
    }
}
