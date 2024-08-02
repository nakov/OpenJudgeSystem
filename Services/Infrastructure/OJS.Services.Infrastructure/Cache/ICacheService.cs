namespace OJS.Services.Infrastructure.Cache
{
    using System;
    using System.Threading.Tasks;

    public interface ICacheService
    {
        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback);

        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration);

        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds);

        Task Remove(string cacheId);
    }
}