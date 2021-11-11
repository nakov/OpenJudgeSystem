namespace OJS.Common.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public static class TaskExtensions
    {
        public static async Task<IOrderedEnumerable<T>> OrderByAsync<T, TProperty>(
            this Task<IEnumerable<T>> enumerable,
            Func<T, TProperty> selector)
            => (await enumerable).OrderBy(selector);

        public static async Task<IOrderedEnumerable<T>> OrderByDescendingAsync<T, TProperty>(
            this Task<IEnumerable<T>> enumerable,
            Func<T, TProperty> selector)
            => (await enumerable).OrderByDescending(selector);

        public static async Task<IEnumerable<T>> TakeAsync<T>(
            this Task<IOrderedEnumerable<T>> enumerable,
            int? limit)
            => limit.HasValue
                ? (await enumerable).Take(limit.Value)
                : await enumerable;
    }
}