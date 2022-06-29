namespace OJS.Servers.Infrastructure.Extensions;

public static class StringExtensions
{
    public static string ToApiName(this string apiVersion)
        => apiVersion
            .Replace(".", "-")
            .Replace(" ", string.Empty);
}