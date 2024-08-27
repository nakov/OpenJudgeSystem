namespace OJS.Common.Extensions;

using System.Collections.Generic;

public static class DictionaryExtensions
{
    public static TValue? GetValueOrDefault<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        TKey key)
        => dictionary.TryGetValue(key, out TValue? value) ? value : default(TValue);

    public static TValue? GetValueOrDefault<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        TKey key,
        TValue? defaultValue)
        => dictionary.TryGetValue(key, out TValue? value) ? value : defaultValue;
}