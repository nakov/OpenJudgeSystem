namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Hosting;
using System;
using System.Text.RegularExpressions;

public static partial class HostEnvironmentExtensions
{
    public static string GetShortApplicationName(this IHostEnvironment hostEnvironment)
    {
        var applicationName = hostEnvironment.ApplicationName;

        // Project name is always the second index, if all conventions are followed.
        // Ojs.Servers.Administration.Controllers for example.
        var projectNameMatch = ProjectNameRegex().Match(applicationName);

        if (!projectNameMatch.Success)
        {
            throw new ArgumentException($"{applicationName} should be declared in a namespace.");
        }

        return projectNameMatch.Groups[1].Value;
    }

    [GeneratedRegex(@"\w+\.\w+\.([\w]+)")]
    private static partial Regex ProjectNameRegex();
}