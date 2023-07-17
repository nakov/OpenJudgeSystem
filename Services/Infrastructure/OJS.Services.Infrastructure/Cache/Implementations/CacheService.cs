namespace OJS.Services.Infrastructure.Cache.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.Extensions.Caching.Distributed;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Options;
    using NPOI.SS.Formula.Functions;
    using OJS.Common.Extensions.Strings;
    using OJS.Services.Common.Models.Configurations;
    using OJS.Services.Infrastructure.Constants;
    using OJS.Services.Infrastructure.Emails;
    using StackExchange.Redis;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public class CacheService : ICacheService
    {
        private readonly int memoryCacheExpirationInSeconds = 10 * 60;
        private readonly IDistributedCache cache;
        private readonly IDatesService dates;
        private readonly IMemoryCache memoryCache;
        private readonly IEmailService emailService;
        private readonly EmailServiceConfig emailConfig;

        public CacheService(
            IDistributedCache cache,
            IDatesService dates,
            IMemoryCache memoryCache,
            IEmailService emailService,
            IOptions<EmailServiceConfig> emailConfig)
        {
            this.cache = cache;
            this.dates = dates;
            this.memoryCache = memoryCache;
            this.emailService = emailService;
            this.emailConfig = emailConfig.Value;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration)
        {
            try
            {
                this.VerifyValueInCache(
                   cacheId,
                   () => Task.FromResult(getItemCallback),
                   absoluteExpiration)
               .Wait();

                return ParseValue<T>(this.cache.Get(cacheId));
            }
            catch (RedisConnectionException ex)
            {
                var exceptionTypeAsString = GetExceptionTypeAsString(ex);

                if (this.ShouldSendExceptionEmail(
                   exceptionTypeAsString,
                   ex.Message))
                {
                    this.emailService.SendEmail(this.emailConfig.DevEmail, exceptionTypeAsString, ex.Message);
                }

                return getItemCallback();
            }
        }

        public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration)
        {
            try
            {
                await this.VerifyValueInCache(
                cacheId,
                getItemCallback,
                absoluteExpiration);

                return ParseValue<T>(await this.cache.GetAsync(cacheId));
            }
            catch (RedisConnectionException ex)
            {
                var exceptionTypeAsString = GetExceptionTypeAsString(ex);

                if (this.ShouldSendExceptionEmail(
                   exceptionTypeAsString,
                   ex.Message))
                {
                    await this.emailService.SendEmailAsync(this.emailConfig.DevEmail, exceptionTypeAsString, ex.Message);
                }

                return await getItemCallback();
            }
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

        public T Get<T>(string cacheId, Func<T> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public void Remove(string cacheId) => this.cache.Remove(cacheId);

        private static string GetExceptionTypeAsString(Exception exception) => exception.GetType().ToString();

        private static T ParseValue<T>(byte[] valueAsByteArray)
            => new StreamReader(new MemoryStream(valueAsByteArray))
                .ReadToEnd()
                .FromJson<T>();

        private static byte[] ParseValue<T>(T obj)
            => obj!
                .ToJson()
                .ToByteArray();

        private DateTime GetAbsoluteExpirationByCacheSeconds(int cacheSeconds)
            => this.dates
                .GetUtcNow()
                .AddSeconds(cacheSeconds);

        private async Task VerifyValueInCache<T>(
            string cacheId,
            Func<Task<T>> getItemCallback,
            DateTime absoluteExpiration)
        {
            var value = await this.cache.GetAsync(cacheId);
            if (value.IsNull())
            {
                var options = new DistributedCacheEntryOptions()
                    .SetAbsoluteExpiration(absoluteExpiration);

                var result = await getItemCallback();
                await this.cache.SetAsync(
                    cacheId,
                    ParseValue(result),
                    options);
            }
        }

        private bool ShouldSendExceptionEmail(string exceptionName, string exceptionValue)
        {
            if (this.memoryCache.TryGetValue(exceptionName, out string cacheValue))
            {
                return false;
            }
            else
            {
                this.memoryCache.Set(
                    exceptionName,
                    exceptionValue,
                    this.GetAbsoluteExpirationByCacheSeconds(this.memoryCacheExpirationInSeconds));

                return true;
            }
        }
    }
}
