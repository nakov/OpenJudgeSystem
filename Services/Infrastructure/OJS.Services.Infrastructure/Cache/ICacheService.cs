namespace OJS.Services.Infrastructure.Cache
{
    using System;
    using System.Threading.Tasks;

    public interface ICacheService
    {
        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback);

        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds, int slidingExpirationSeconds = 0);

        Task Remove(string cacheId);
    }
}