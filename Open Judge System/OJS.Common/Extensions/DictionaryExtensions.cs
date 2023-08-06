namespace OJS.Common.Extensions
{
    using System.Collections.Generic;

    public static class DictionaryExtensions
    {
        public static TValue GetValuerOrDefault<TKey, TValue>(
            this IDictionary<TKey, TValue> dictionary,
            TKey key,
            TValue defaultValue = default(TValue)) =>
            dictionary.ContainsKey(key) ? dictionary[key] : defaultValue;
    }
}