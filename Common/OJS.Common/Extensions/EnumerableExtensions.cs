namespace OJS.Common.Extensions;

using System;
using System.Collections.Generic;
using System.Linq;

public static class EnumerableExtensions
{
    public static T? MaxOrDefault<T>(this IEnumerable<T> enumerable)
        => enumerable.DefaultIfEmpty()
            .Max();
}