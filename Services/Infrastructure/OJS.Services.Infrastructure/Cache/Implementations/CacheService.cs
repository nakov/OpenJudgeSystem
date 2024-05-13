namespace OJS.Services.Infrastructure.Cache.Implementations
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.Extensions.Caching.Distributed;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Options;
    using OJS.Common.Extensions.Strings;
    using OJS.Services.Infrastructure.Configurations;
    using OJS.Services.Infrastructure.Constants;
    using OJS.Services.Infrastructure.Emails;
    using StackExchange.Redis;

    public class CacheService : ICacheService
    {
        private readonly int memoryCacheExpirationInSeconds = 10 * 60;
        private readonly IDistributedCache cache;
        private readonly IDatesService dates;
        private readonly IMemoryCache memoryCache;
        private readonly IEmailService emailService;
        private readonly EmailServiceConfig emailConfig;
        private readonly IConnectionMultiplexer redisConnection;

        public CacheService(
            IDistributedCache cache,
            IDatesService dates,
            IMemoryCache memoryCache,
            IEmailService emailService,
            IOptions<EmailServiceConfig> emailConfig,
            IConnectionMultiplexer redisConnection)
        {
            this.cache = cache;
            this.dates = dates;
            this.memoryCache = memoryCache;
            this.emailService = emailService;
            this.redisConnection = redisConnection;
            this.emailConfig = emailConfig.Value;
        }

        public T Get<T>(string cacheId, Func<T> getItemCallback, DateTime absoluteExpiration) =>
            this.GetItemResult(
                () =>
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
                        this.SendEmailMessage(ex);

                        return getItemCallback();
                    }
                },
                getItemCallback);

        public async Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, DateTime absoluteExpiration) =>
            await this.GetItemResultAsync(
                async () =>
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
                        this.SendEmailMessage(ex);

                        return await getItemCallback();
                    }
                },
                getItemCallback);

        public T Get<T>(string cacheId, Func<T> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback)
            => this.Get(cacheId, getItemCallback, CacheConstants.OneDayInSeconds);

        public T Get<T>(string cacheId, Func<T> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public Task<T> Get<T>(string cacheId, Func<Task<T>> getItemCallback, int cacheSeconds)
            => this.Get(cacheId, getItemCallback, this.GetAbsoluteExpirationByCacheSeconds(cacheSeconds));

        public void Remove(string cacheId)
        {
            if (!this.IsRedisConnected())
            {
                this.emailService.SendEmail(
                    this.emailConfig.DevEmail,
                    EmailConstants.RedisSubject,
                    EmailConstants.RedisBody);
            }

            try
            {
                this.cache.Remove(cacheId);
            }
            catch (RedisCommandException ex)
            {
                this.emailService.SendEmail(this.emailConfig.DevEmail, GetExceptionTypeAsString(ex), ex.Message);
            }
        }

        private static T ParseValue<T>(byte[] valueAsByteArray)
            => new StreamReader(new MemoryStream(valueAsByteArray))
                .ReadToEnd()
                .FromJson<T>();

        private static byte[] ParseValue<T>(T obj)
            => obj!
                .ToJson()
                .ToByteArray();

        private static string GetExceptionTypeAsString(Exception exception) => exception.GetType().ToString();

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

        private async Task<T> GetItemResultAsync<T>(Func<Task<T>> resultAction, Func<Task<T>> fallbackResultAction)
        {
            if (!this.IsRedisConnected())
            {
                if (this.ShouldSendExceptionEmail(EmailConstants.RedisSubject, EmailConstants.RedisBody))
                {
                    await this.emailService.SendEmailAsync(
                        this.emailConfig.DevEmail,
                        EmailConstants.RedisSubject,
                        EmailConstants.RedisBody);
                }

                return await fallbackResultAction();
            }

            try
            {
                return await resultAction();
            }
            catch (RedisConnectionException ex)
            {
                await this.emailService.SendEmailAsync(this.emailConfig.DevEmail, ex.GetType().ToString(), ex.Message);
                return await fallbackResultAction();
            }
        }

        private T GetItemResult<T>(Func<T> resultAction, Func<T> fallbackResultAction)
        {
            if (!this.IsRedisConnected())
            {
                if (this.ShouldSendExceptionEmail(EmailConstants.RedisSubject, EmailConstants.RedisBody))
                {
                    this.emailService.SendEmail(
                        this.emailConfig.DevEmail,
                        EmailConstants.RedisSubject,
                        EmailConstants.RedisBody);
                }

                return fallbackResultAction();
            }

            try
            {
                return resultAction();
            }
            catch (RedisConnectionException ex)
            {
                this.emailService.SendEmail(this.emailConfig.DevEmail, ex.GetType().ToString(), ex.Message);
                return fallbackResultAction();
            }
        }

        private bool IsRedisConnected() => this.redisConnection is { IsConnecting: false, IsConnected: true };

        private bool ShouldSendExceptionEmail(string exceptionName, string exceptionValue)
        {
            if (this.memoryCache.TryGetValue(exceptionName, out string cacheValue))
            {
                return false;
            }

            this.memoryCache.Set(
                exceptionName,
                exceptionValue,
                this.GetAbsoluteExpirationByCacheSeconds(this.memoryCacheExpirationInSeconds));

            return true;
        }

        private void SendEmailMessage(RedisConnectionException ex)
        {
            var exceptionTypeAsString = GetExceptionTypeAsString(ex);

            if (this.ShouldSendExceptionEmail(
                    exceptionTypeAsString,
                    ex.Message))
            {
                this.emailService.SendEmail(this.emailConfig.DevEmail, exceptionTypeAsString, ex.Message);
            }
        }
    }
}