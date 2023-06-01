namespace OJS.Data.Infrastructure.DateTimeConverters.UtcToLocalDateTimeConverter;

using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Data.Common;

public class UtcToLocalDateTimeConvertingDbCommandInterceptor : DbCommandInterceptor
{
    public override DbDataReader ReaderExecuted(DbCommand command, CommandExecutedEventData eventData, DbDataReader result)
    {
        base.ReaderExecuted(command, eventData, result);
        if (!(result is UtcToLocalDateTimeConvertingDbDataReader))
        {
            result = new UtcToLocalDateTimeConvertingDbDataReader(result);
        }

        return result;
    }
}