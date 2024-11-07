namespace OJS.Services.Infrastructure.Models;

public static class ModelHelpers
{
    public static (long? MaxMemoryUsed, int? MaxTimeUsed) GetMaxMemoryAndTimeUsed(string? testRunsCache)
    {
        if (string.IsNullOrWhiteSpace(testRunsCache))
        {
            return (null, null);
        }

        var cacheParts = testRunsCache.Split('|');
        if (cacheParts.Length <= 1)
        {
            return (null, null);
        }

        var timeMemoryPart = cacheParts[1];
        var timeMemoryValues = timeMemoryPart.Split(',');

        if (timeMemoryValues.Length < 2)
        {
            return (null, null);
        }

        if (int.TryParse(timeMemoryValues[0], out var maxTimeUsed) &&
            long.TryParse(timeMemoryValues[1], out var maxMemoryUsed))
        {
            return (maxMemoryUsed, maxTimeUsed);
        }

        return (null, null);
    }
}