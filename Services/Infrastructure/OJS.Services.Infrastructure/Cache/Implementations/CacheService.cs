namespace OJS.Services.Infrastructure.Cache.Implementations
{
    using Microsoft.Extensions.Caching.Memory;
    using System;
    using System.Threading.Tasks;

    public class CacheService : ICacheService
    {
        // TODO: IMemoryCache does not work when used from different apps.
        // https://github.com/SoftUni-Internal/exam-systems-issues/issues/156
        private readonly IMemoryCache memoryCache;
        private readonly IDatesService dates;

        public CacheService(
            IMemoryCache memoryCache,
            IDatesService dates)
        {
            this.memoryCache = memoryCache;
            this.dates = dates;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration)
        {
            if (this.memoryCache.TryGetValue(cacheId, out T item))
            {
                return item;
            }

            item = getItemCallback();

            return this.SetCache(cacheId, item, absoluteExpiration);
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, int? cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int? cacheSeconds)
        {
            if (this.memoryCache.TryGetValue(cacheId, out T item))
            {
                return item;
            }

            item = await getItemCallback();

            return this.SetCache(cacheId, item, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));
        }

        public void Remove(string cacheId) => this.memoryCache.Remove(cacheId);

        private T SetCache<T>(string cacheId, T item, DateTime absoluteExpiration)
            => this.memoryCache.Set(
                cacheId,
                item,
                absoluteExpiration);

        private DateTime GetAbsoluteExpirationByCacheSeconds(int? cacheSeconds)
            => cacheSeconds.HasValue
                ? this.dates.GetUtcNow().AddSeconds(cacheSeconds.Value)
                : this.dates.GetMaxValue();
    }
}