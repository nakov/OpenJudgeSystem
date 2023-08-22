namespace OJS.Services.Administration.Business;

using OJS.Common.Utils;
using System;
using static OJS.Common.GlobalConstants.EnvironmentVariables;

public static class AdministrationConstants
{
    public static TimeZoneInfo LocalTimeZoneInfo { get; } = TimeZoneInfo.FindSystemTimeZoneById(
        EnvironmentUtils.GetRequiredByKey(LocalTimeZone));
}