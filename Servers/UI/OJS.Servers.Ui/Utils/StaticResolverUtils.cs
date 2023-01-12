namespace OJS.Servers.Ui.Utils;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public static class StaticResolverUtils
{
    public static IEnumerable<string> ResolveByType(string type)
    {
        var pathPartial = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
            ? "dist"
            : "build";

        var path = $"./ClientApp/{pathPartial}/static/{type}";

        return Directory.GetFiles(path)
            .Where(f => f.EndsWith($".{type}"))
            .Select(f => f["./wwwroot./ClientApp/{pathPartial}/".Length..]);
    }
}