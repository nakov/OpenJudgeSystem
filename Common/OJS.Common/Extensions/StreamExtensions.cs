namespace OJS.Common.Extensions;

using System.IO;
using Newtonsoft.Json;

public static class StreamExtensions
{
    public static T? DeserializeJson<T>(this Stream stream)
    {
        using var streamReader = new StreamReader(stream);
        using var jsonTextReader = new JsonTextReader(streamReader);
        var jsonSerializer = new JsonSerializer();

        return jsonSerializer.Deserialize<T>(jsonTextReader);
    }
}