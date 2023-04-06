namespace OJS.Common.Extensions;

using System.IO;
using FluentExtensions.Extensions;

public static class StreamExtensions
{
    public static T FromJson<T>(this Stream stream)
    {
        using var streamReader = new StreamReader(stream);
        var json = streamReader.ReadToEnd();

        return json.FromJson<T>();
    }
}