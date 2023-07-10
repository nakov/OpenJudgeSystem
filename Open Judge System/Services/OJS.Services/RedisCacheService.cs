using Newtonsoft.Json;
using OJS.Services.Cache;
using OJS.Services.Common.Emails;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace OJS.Services
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly IDatabase redisCache;
        private readonly IEmailSenderService emailSenderService;

        public RedisCacheService(IDatabase redisCache, IEmailSenderService emailSenderService)
        {
            this.redisCache = redisCache;
            this.emailSenderService = emailSenderService;
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
                this.emailSenderService.SendEmail(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
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
                await this.emailSenderService.SendEmailAsync(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
                return await getItemCallback();
            }

        }

        public T GetOrSet<T>(string cacheId, Func<T> getItemCallback, TimeSpan? expiration = null)
        {
            try
            {
                this.VerifyValueInCache<T>(cacheId, getItemCallback, expiration);
                return this.Get<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                this.emailSenderService.SendEmail(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
                return getItemCallback();
            }
        }

        public async Task<T> GetOrSetAsync<T>(string cacheId, Func<Task<T>> getItemCallback, TimeSpan? expiration)
        {
            try
            {
                await this.VerifyValueInCacheAsync<T>(cacheId, getItemCallback, expiration);

                return await this.GetAsync<T>(cacheId, getItemCallback);
            }
            catch (RedisConnectionException ex)
            {
                await this.emailSenderService.SendEmailAsync(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
                return await getItemCallback();
            }
        }

        public void Set<T>(string cacheId, T value, TimeSpan? expiration)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);

                if (expiration.HasValue)
                {
                    this.redisCache.StringSet(cacheId, serializedObject, expiration);
                }
                else
                {
                    this.redisCache.StringSet(cacheId, serializedObject);
                }
            }
            catch (RedisConnectionException ex)
            {
                this.emailSenderService.SendEmail(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
            }
        }

        public async Task SetAsync<T>(string cacheId, T value, TimeSpan? expiration)
        {
            try
            {
                string serializedObject = JsonConvert.SerializeObject(value);

                if (expiration.HasValue)
                {
                    await this.redisCache.StringSetAsync(cacheId, serializedObject, expiration);
                }
                else
                {
                    await this.redisCache.StringSetAsync(cacheId, serializedObject);
                }
            }
            catch (RedisConnectionException ex)
            {
                await this.emailSenderService.SendEmailAsync(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
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
                this.emailSenderService.SendEmail(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
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
                await this.emailSenderService.SendEmailAsync(this.emailSenderService.GetDevEmail(), ex.GetType().ToString(), ex.Message);
            }
        }

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
    }
}
