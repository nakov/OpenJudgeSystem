namespace OJS.Common.Extensions;

using FluentExtensions.Extensions;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

public static class ObjectExtensions
{
    public static T[]? WrapInArray<T>(this T item)
         => item != null
            ? new T[] { item }
            : null;

    public static List<TItem>? WrapInList<TItem>(this TItem item)
        => item != null
            ? new List<TItem> { item }
            : null;

    public static Task<T> ToTask<T>(this T item)
        => Task.FromResult(item);

    public static bool IsNull(this object obj)
        => obj == null;

    public static T DeepCopy<T>(this T obj)
    {
        var bytes = Encoding.UTF8.GetBytes(obj!.ToJson());
        using (var stream = new MemoryStream(bytes))
        using (var reader = new StreamReader(stream))
        {
            return reader.ReadToEnd()
                .FromJson<T>();
        }
    }
}
