namespace OJS.Services.Infrastructure.Cache.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.Extensions.Caching.Distributed;
    using OJS.Common.Extensions.Strings;
    using OJS.Services.Infrastructure.Constants;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public class CacheService : ICacheService
    {
        private readonly IDistributedCache cache;
        private readonly IDatesService dates;

        public CacheService(
            IDistributedCache cache,
            IDatesService dates)
        {
            this.cache = cache;
            this.dates = dates;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration)
        {
            this.VerifyValueInCache(
                    cacheId,
                    () => Task.FromResult(getItemCallback),
                    absoluteExpiration)
                .Wait();

            return ParseValue<T>(this.cache.Get(cacheId));
        }

        public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration)
        {
            await this.VerifyValueInCache(
                cacheId,
                getItemCallback,
                absoluteExpiration);
            return ParseValue<T>(await this.cache.GetAsync(cacheId));
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneHourInSeconds);

        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneHourInSeconds);

        public T Get<T>(string cacheId, Func<T> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));


        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public void Remove(string cacheId) => this.cache.Remove(cacheId);

        private static T ParseValue<T>(byte[] valueAsByteArray)
            => new StreamReader(new MemoryStream(valueAsByteArray))
                .ReadToEnd()
                .FromJson<T>();

        private static byte[] ParseValue<T>(T obj)
            => obj
                .ToJson()
                .ToByteArray();

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
    }
}