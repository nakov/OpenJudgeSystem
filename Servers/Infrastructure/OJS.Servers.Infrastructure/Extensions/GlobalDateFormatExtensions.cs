namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using static Common.GlobalConstants;

public static class GlobalDateFormatExtensions
{
    public static IServiceCollection ConfigureGlobalDateFormat(this IServiceCollection services)
    {
        var culture = new CultureInfo(CultureInfo.InvariantCulture.Name);
        culture.DateTimeFormat.ShortDatePattern = ApplicationDateFormats.GlobalShortDatePatternFormat;

        CultureInfo.DefaultThreadCurrentCulture = culture;

        return services;
    }
}