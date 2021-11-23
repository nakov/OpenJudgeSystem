namespace OJS.Services.Infrastructure.Cache.Implementations
{
    using Microsoft.Extensions.Caching.Memory;
    using System;

    public class CacheService : ICacheService
    {
        private readonly IMemoryCache memoryCache;

        public CacheService(IMemoryCache memoryCache)
            => this.memoryCache = memoryCache;

        public T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration)
            where T : class
        {
            if (this.memoryCache.TryGetValue(cacheId, out T item))
            {
                return item;
            }

            item = getItemCallback();

            SetCache(cacheId, item, absoluteExpiration);

            return item;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, int? cacheSeconds)
            where T : class
        {
            var absoluteExpiration = cacheSeconds.HasValue
                ? DateTime.Now.AddSeconds(cacheSeconds.Value)
                : DateTime.MaxValue;

            return this.Get(cacheId, getItemCallback, absoluteExpiration);
        }

        public void Remove(string cacheId) => this.memoryCache.Remove(cacheId);

        private void SetCache<T>(string cacheId, T item, DateTime absoluteExpiration)
            => this.memoryCache.Set(
                cacheId,
                item,
                absoluteExpiration);
    }
}