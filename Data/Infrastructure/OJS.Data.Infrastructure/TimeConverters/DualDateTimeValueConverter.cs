namespace OJS.Data.Infrastructure.TimeConverters;

using Common.Utils;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq.Expressions;

using static Common.GlobalConstants.EnvironmentVariables;

/// <summary>
/// When serializes DateTime input, this converter interprets it as Local Time Zone (Local time zone is
/// specified in the app config) and converts it to UTC (for storage in the db). On the other way around
/// when deserializing the DateTime, interprets it as UTC and returns it converted to Local time.
/// </summary>
public class DualDateTimeValueConverter : ValueConverter<DateTime?, DateTime?>
{
    private static readonly TimeZoneInfo LocalTimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(EnvironmentUtils.GetRequiredByKey(LocalTimeZone));

    private static readonly Expression<Func<DateTime?, DateTime?>> Serialize = date => ConvertToUtc(date);

    private static readonly Expression<Func<DateTime?, DateTime?>> Deserialize = date => ConvertToLocal(date);

    public DualDateTimeValueConverter()
        : base(Serialize, Deserialize)
    {
    }

    private static DateTime? ConvertToUtc(DateTime? dateTime)
    {
        if (dateTime == null)
        {
            return null;
        }

        var convertToUnspecifiedDate = DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Unspecified);

        return TimeZoneInfo.ConvertTimeToUtc(convertToUnspecifiedDate, LocalTimeZoneInfo);
    }

    private static DateTime? ConvertToLocal(DateTime? dateTime)
    {
        if (dateTime == null)
        {
            return null;
        }

        return TimeZoneInfo.ConvertTimeFromUtc(dateTime.Value, LocalTimeZoneInfo);
    }
}