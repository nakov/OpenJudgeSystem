namespace OJS.Services.Common.Data;

using System;
using System.Collections.Concurrent;
using System.Reflection;

public static class PropertyInfoCache
{
    private static readonly ConcurrentDictionary<(Type, string), PropertyInfo> Cache = new();

    public static PropertyInfo GetPropertyInfo<T>(string propertyName)
        => GetPropertyInfo(typeof(T), propertyName);

    public static PropertyInfo GetPropertyInfo(Type type, string propertyName)
        => Cache.GetOrAdd((type, propertyName), key =>
        {
            var (targetType, propName) = key;
            var propertyInfo = targetType.GetProperty(propName);
            if (propertyInfo == null)
            {
                throw new InvalidOperationException($"Property '{propName}' not found on type '{targetType}'.");
            }

            return propertyInfo;
        });
}