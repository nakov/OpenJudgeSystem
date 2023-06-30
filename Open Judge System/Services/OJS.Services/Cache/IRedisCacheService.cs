using OJS.Services.Common;
using System;
using System.Threading.Tasks;

namespace OJS.Services.Cache
{
    public interface IRedisCacheService : IService
    {
        T Get<T>(string cacheId);

        Task<T> GetAsync<T>(string cacheId);

        void Set<T>(string cacheId, T value, TimeSpan? expiration);

        Task SetAsync<T>(string cacheId, T value, TimeSpan? expiration);

        T GetOrSet<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan? expiration);
        Task<T> GetOrSetAsync<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan? expiration);

        void Remove(string cacheId);

        Task RemoveAsync(string cacheId);
    }
}
