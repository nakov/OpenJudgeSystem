namespace OJS.Common.Extensions;

using System;

public static class EnumExtensions
{
    public static T? GetValidTypeOrNull<T>(this T? enumerationValue)
        where T : struct
    {
        if (enumerationValue.HasValue &&
            Enum.IsDefined(typeof(T), enumerationValue) &&
            !enumerationValue.Value.Equals(default(T)))
        {
            return enumerationValue;
        }

        return null;
    }
}