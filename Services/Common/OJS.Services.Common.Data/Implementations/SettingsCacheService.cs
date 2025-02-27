namespace OJS.Services.Common.Data.Implementations;

using OJS.Data.Models;
using OJS.Services.Infrastructure.Cache;
using System;
using System.Globalization;
using System.Threading.Tasks;
using static OJS.Services.Infrastructure.Constants.CacheConstants;

public class SettingsCacheService(
    ICacheService cache,
    IDataService<Setting> settingsData)
    : ISettingsCacheService
{
    public async Task<T> GetRequiredValue<T>(string name)
    {
        var value = await this.GetValueFromCache(name);

        return value == null
            ? throw new ArgumentNullException(name)
            : ChangeType<T>(value);
    }

    public async Task<T> GetValue<T>(string name, T defaultValue)
    {
        var value = await this.GetValueFromCache(name);

        return value == null
            ? defaultValue
            : ChangeType<T>(value);
    }

    private async Task<string?> GetValueFromCache(string name)
        => await cache.Get(string.Format(CultureInfo.InvariantCulture, SettingsFormat, name), async () =>
        {
            var dbSetting = await settingsData.One(s => s.Name == name);

            return dbSetting?.Value;
        });

    private static T ChangeType<T>(string value)
        => (T)Convert.ChangeType(value, typeof(T), CultureInfo.InvariantCulture);
}