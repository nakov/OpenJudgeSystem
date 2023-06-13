namespace OJS.Data.Infrastructure.TimeConverters;

using Common.Utils;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq.Expressions;

using static Common.GlobalConstants.EnvironmentVariables;

public class LocalDateConverter : ValueConverter<DateTime?, DateTime?>
{
    private static readonly TimeZoneInfo LocalTimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(EnvironmentUtils.GetRequiredByKey(LocalTimeZone));

    private static readonly Expression<Func<DateTime?, DateTime?>> Serialize = date => date;

    private static readonly Expression<Func<DateTime?, DateTime?>> Deserialize = date => ConvertToLocal(date);

    public LocalDateConverter()
        : base(Serialize, Deserialize)
    {
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