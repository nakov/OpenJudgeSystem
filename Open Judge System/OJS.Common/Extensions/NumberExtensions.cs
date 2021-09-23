namespace OJS.Common.Extensions
{
    using System.Globalization;

    public static class NumberExtensions
    {
        public static string ToSeparatedString(this int number, string separator)
            => number.ToString("#,0", GetNumberFormatInfoForGroupSeparation(separator));

        private static NumberFormatInfo GetNumberFormatInfoForGroupSeparation(string separator)
        {
            var numberFormatInfo = (NumberFormatInfo)CultureInfo.InvariantCulture.NumberFormat.Clone();
            numberFormatInfo.NumberGroupSeparator = separator;

            return numberFormatInfo;
        }
    }
}
