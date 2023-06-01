namespace OJS.Data.Infrastructure.DateTimeConverters.UtcToLocalDateTimeConverter;

using System;
using System.Data.Common;

public class UtcToLocalDateTimeConvertingDbDataReader : DelegatingDbDataReader
{
    public UtcToLocalDateTimeConvertingDbDataReader(DbDataReader source)
        : base(source)
    {
    }

    public override DateTime GetDateTime(int ordinal) => TimeZoneInfo.ConvertTime(base.GetDateTime(ordinal), TimeZoneInfo.Local);
}