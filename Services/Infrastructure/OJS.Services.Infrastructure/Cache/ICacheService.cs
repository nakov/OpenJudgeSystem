namespace OJS.Services.Infrastructure.Cache
{
    using SoftUni.Services.Infrastructure;
    using System;

    public interface ICacheService : IService
    {
        T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration)
           where T : class;

        T Get<T>(string cacheId, Func<T> getItemCallback, int? cacheSeconds)
            where T : class;

        void Remove(string cacheId);
    }
}