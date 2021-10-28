namespace OJS.Common.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public static class EnumerableExtensions
    {
        public static void ForEach<T>(this IEnumerable<T> enumerable, Action<T> action)
        {
            var enumerableAsArray = enumerable as T[] ?? enumerable.ToArray();

            foreach (var item in enumerableAsArray)
            {
                action(item);
            }
        }
    }
}