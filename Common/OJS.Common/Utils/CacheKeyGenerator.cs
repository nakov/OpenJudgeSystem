namespace OJS.Common.Utils;

using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

public static class CacheKeyGenerator
{
    public static string GenerateKeyForPrimitiveCollection<T>(IEnumerable<T> values)
        where T : struct
    {
        // Convert the collection to a comma-separated string
        var concatenatedString = string.Join(",", values);

        // Use SHA256 hashing to generate a unique string
        using SHA256 sha256Hash = SHA256.Create();
        var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(concatenatedString));

        // Convert byte array to a string
        StringBuilder builder = new StringBuilder();
        foreach (var t in bytes)
        {
            builder.Append(t.ToString("x2"));
        }

        return builder.ToString();
    }
}