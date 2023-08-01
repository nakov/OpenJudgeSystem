using Newtonsoft.Json;
using OJS.Services.Cache;
using OJS.Services.Common.Emails;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace OJS.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDatabase redisCache;
        private readonly double memmoryCacheExpirationInMinutes = 5;
        private readonly IEmailSenderService emailSenderService;
        private readonly string devEmail;

        public RedisCacheService(IDatabase redisCache, IEmailSenderService emailSenderService, string devEmail)
        {
            this.redisCache = redisCache;
            this.emailSenderService = emailSenderService;
            this.devEmail = devEmail;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback)
        {
            try
            {
                var valueAsString = this.redisCache.StringGet(cacheId);

                if (valueAsString.IsNull)
                {
                    return getItemCallback();
                }

                return JsonConvert.DeserializeObject<T>(valueAsString);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);

                return getItemCallback();
            }
        }

        public async Task<T> GetAsync<T>(string cacheId, Func<Task<T>> getItemCallback)
        {
            try
            {
                var valueAsString = await this.redisCache.StringGetAsync(cacheId);
                if (valueAsString.IsNull)
                {
                    return await getItemCallback();
                }

                return JsonConvert.DeserializeObject<T>(valueAsString);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);

                return await getItemCallback();
            }
        }

        public T GetOrSet<T>(string cacheId, Func<T> getItemCallback, TimeSpan expiration)
        {
            try
            {
                this.VerifyValueInCache<T>(cacheId, getItemCallback, expiration);
                return this.Get<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);

                return getItemCallback();
            }
        }

        public T GetOrSet<T>(string cacheId, Func<T> getItemCallback)
        {
            try
            {
                this.VerifyValueInCache<T>(cacheId, getItemCallback, null);
                return this.Get<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);

                return getItemCallback();
            }
        }

        public async Task<T> GetOrSetAsync<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan expiration)
        {
            try
            {
                await this.VerifyValueInCacheAsync<T>(cacheId, getItemCallback, expiration);

                return await this.GetAsync<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);

                return await getItemCallback();
            }
        }

        public async Task<T> GetOrSetAsync<T>(string cacheId, Func<Task<T>> getItemCallback)
        {
            try
            {
                await this.VerifyValueInCacheAsync<T>(cacheId, getItemCallback, null);

                return await this.GetAsync<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);

                return await getItemCallback();
            }
        }

        public void Set<T>(string cacheId, T value, TimeSpan expiration)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);
                this.redisCache.StringSet(cacheId, serializedObject, expiration);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);
            }
        }

        public void Set<T>(string cacheId, T value)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);
                this.redisCache.StringSet(cacheId, serializedObject);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);
            }
        }

        public async Task SetAsync<T>(string cacheId, T value, TimeSpan expiration)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);
                await this.redisCache.StringSetAsync(cacheId, serializedObject, expiration);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);
            }
        }

        public async Task SetAsync<T>(string cacheId, T value)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);
                await this.redisCache.StringSetAsync(cacheId, serializedObject);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);
            }
        }

        public void Remove(string cacheId)
        {
            try
            {
                this.redisCache.KeyDelete(cacheId);
            }
            catch (RedisConnectionException ex)
            {
                this.SendEmail(ex.GetType().ToString(), ex.Message);
            }
        }

        public async Task RemoveAsync(string cacheId)
        {
            try
            {
                await this.redisCache.KeyDeleteAsync(cacheId);
            }
            catch (RedisConnectionException ex)
            {
                await this.SendEmailAsync(ex.GetType().ToString(), ex.Message);

            }
        }

        public bool ContainsKey(string cacheId) => this.redisCache.KeyExists(cacheId);

        public async Task<bool> ContainsKeyAsync(string cacheId)
        {
            return await this.redisCache.KeyExistsAsync(cacheId);
        }

        #region private
        private async Task VerifyValueInCacheAsync<T>(
            string cacheId,
            Func<Task<T>> getItemCallback,
            TimeSpan? expiration)
        {
            if (!await this.redisCache.KeyExistsAsync(cacheId))
            {
                var result = await getItemCallback();

                var parsedValue = JsonConvert.SerializeObject(result);
                await this.redisCache.StringSetAsync(
                    cacheId,
                    parsedValue,
                    expiration);
            }
        }

        private void VerifyValueInCache<T>(
            string cacheId,
            Func<T> getItemCallback,
            TimeSpan? expiration)
        {
            if (!this.redisCache.KeyExists(cacheId))
            {
                var result = getItemCallback();

                var parsedValue = JsonConvert.SerializeObject(result);
                this.redisCache.StringSet(
                   cacheId,
                   parsedValue,
                   expiration);
            }
        }

        private bool ShouldSendEmail(string key, string value)
        {
            if (HttpRuntime.Cache.Get(key) == null)
            {
                HttpContext.Current.Cache.Add(
                   key,
                   value,
                   null,
                   DateTime.Now.AddMinutes(this.memmoryCacheExpirationInMinutes),
                   TimeSpan.Zero,
                   CacheItemPriority.Default,
                   null);
                return false;
            }
            return true;
        }

        private void SendEmail(string exTypeAsString, string exMessage)
        {
            if (!this.ShouldSendEmail(exTypeAsString, exMessage))
            {
                this.emailSenderService.SendEmail(this.devEmail, exTypeAsString, exMessage);
            }
        }

        private async Task SendEmailAsync(string exTypeAsString, string exMessage)
        {
            if (!this.ShouldSendEmail(exTypeAsString, exMessage))
            {
                await this.emailSenderService.SendEmailAsync(this.devEmail, exTypeAsString, exMessage);
            }
        }
        #endregion
    }
}