namespace OJS.Data.Infrastructure;

using Common.Utils;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq.Expressions;
using static Common.GlobalConstants.EnvironmentVariables;

public class DateTimeValueConverter : ValueConverter<DateTime?, DateTime?>
{
   private static readonly TimeZoneInfo TimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(EnvironmentUtils.GetRequiredByKey(LocalTimeZone));

   private static readonly Expression<Func<DateTime?, DateTime?>> Serialize = date => ConvertToUtc(date);

   private static readonly Expression<Func<DateTime?, DateTime?>> Deserialize = date => ConvertToLocal(date);

   public DateTimeValueConverter()
      : base(Serialize, Deserialize)
   {
   }

   private static DateTime? ConvertToUtc(DateTime? dateTime)
   {
      if (dateTime == null)
      {
         return null;
      }

      return TimeZoneInfo.ConvertTimeToUtc(dateTime.Value);
   }

   private static DateTime? ConvertToLocal(DateTime? dateTime)
   {
      if (dateTime == null)
      {
         return null;
      }

      return TimeZoneInfo.ConvertTimeFromUtc(dateTime.Value, TimeZoneInfo);
   }
}