namespace OJS.Data.Infrastructure;

using Common.Utils;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq.Expressions;
using static Common.GlobalConstants.EnvironmentVariables;

public class DateTimeValueConverter : ValueConverter<DateTime?, DateTime?>
{
   private static readonly TimeZoneInfo LocalTimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(EnvironmentUtils.GetRequiredByKey(LocalTimeZone));

   private static readonly Expression<Func<DateTime?, DateTime?>> Deserialize = date => ConvertToLocal(date);

   public DateTimeValueConverter(string propertyName)
      : base(Serialize(propertyName), Deserialize)
   {
   }

   private static Expression<Func<DateTime?, DateTime?>> Serialize(string propertyName) =>
      date => ShouldConvertToUtc(propertyName) ? ConvertToUtc(date) : date;

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

   private static bool ShouldConvertToUtc(string propertyName)
      => propertyName != "CreatedOn" && propertyName != "ModifiedOn" && propertyName != "DeletedOn";
}