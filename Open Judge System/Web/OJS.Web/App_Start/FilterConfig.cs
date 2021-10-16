﻿namespace OJS.Web
{
    using System.Collections.Generic;
    using System.Web.Mvc;

    using MissingFeatures;
    using OJS.Web.Infrastructure.Filters;
    using Suls.Web.Common.Filters;

    public class FilterConfig
    {
        public static void RegisterGlobalFilters(
            GlobalFilterCollection filters,
            IEnumerable<object> otherFilters = null)
        {
            filters.Add(new HttpThrottleFilter(
                Settings.ThrottleLimitPerSecond,
                Settings.ThrottleLimitPerMinute,
                Settings.ThrottleLimitPerHour,
                Settings.ThrottleLimitPerDay,
                Settings.ThrottleIpWhitelist));

            filters.Add(new HandleErrorAttribute());
            filters.Add(new CustomExceptionHandlerFilter());

            otherFilters?.ForEach(filters.Add);
        }
    }
}