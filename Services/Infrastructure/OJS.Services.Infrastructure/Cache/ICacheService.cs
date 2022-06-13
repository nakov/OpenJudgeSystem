namespace OJS.Services.Infrastructure.Cache
{
    using SoftUni.Services.Infrastructure;
    using System;
    using System.Threading.Tasks;

    public interface ICacheService : IService
    {
        T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration);

        T Get<T>(string cacheId, Func<T> getItemCallback, int? cacheSeconds);

        Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int? cacheSeconds);

        void Remove(string cacheId);
    }
}