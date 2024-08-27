namespace OJS.Services.Infrastructure.Cache
{
    using System;
    using System.Threading.Tasks;

    public interface ICacheService
    {
        Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback);

        Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration);

        Task<T> GetItem<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds);

        Task Remove(string cacheId);
    }
}