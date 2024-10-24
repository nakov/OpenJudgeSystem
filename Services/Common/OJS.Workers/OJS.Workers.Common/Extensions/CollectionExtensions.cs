namespace OJS.Workers.Common.Extensions;

public static class CollectionExtensions
{
    public static void AddRange<T>(this ICollection<T> destination, IEnumerable<T> source)
    {
        foreach (var obj in source)
        {
            destination.Add(obj);
        }
    }

    public static TResult GetValueOrSelectDefault<TKey, TValue, TResult>(
        this Dictionary<TKey, TValue> dictionary,
        TKey key,
        Func<TValue, TResult> selector,
        TResult defaultValue) where TKey : notnull
            => dictionary.TryGetValue(key, out var value) ? selector(value) : defaultValue;
}