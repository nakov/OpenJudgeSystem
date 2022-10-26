namespace OJS.Common.Extensions
{
    using System;

    public static class DateTimeExtensions
    {
        public static double GetMinutesDifferenceRounded(this DateTime value, DateTime timeToCompareWith)
            => Math.Round((value - timeToCompareWith).TotalMinutes, 0);
    }
}