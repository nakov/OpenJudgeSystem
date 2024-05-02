namespace OJS.Common.Extensions;

using FluentExtensions.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

public static class AssemblyExtensions
{
    public static IEnumerable<Assembly> GetAllReferencedAssembliesWhereFullNameMatchesPatterns(
        this Assembly assembly,
        params string[] regexPatterns)
    {
        var returnAssemblies = new List<Assembly>();
        var loadedAssemblies = new HashSet<string>();
        var assembliesToCheck = new Queue<Assembly>();

        assembliesToCheck.Enqueue(assembly);

        var assemblyPrefix = assembly.GetPrefix();

        while (assembliesToCheck.Any())
        {
            var assemblyToCheck = assembliesToCheck.Dequeue();

            assemblyToCheck
                .GetReferencedAssemblies()
                .Where(x => x.FullName.StartsWith(assemblyPrefix))
                .ForEach(reference =>
                {
                    if (loadedAssemblies.Contains(reference.FullName))
                    {
                        return;
                    }

                    var loadedAssembly = Assembly.Load(reference);
                    assembliesToCheck.Enqueue(loadedAssembly);
                    loadedAssemblies.Add(reference.FullName);
                    returnAssemblies.Add(loadedAssembly);
                });
        }

        var regexes = regexPatterns.Select(rp => new Regex(rp));

        return returnAssemblies
            .Where(x => regexes.Any(r => x.FullName != null && r.IsMatch(x.FullName)));
    }

    /// <summary>
    /// Gets the common convention prefix used in all assemblies from the solution.
    /// For example the prefix in the assembly "Interactive.Servers.Courses.Controllers" is "Interactive".
    /// </summary>
    /// <param name="assembly">The assembly of which to get the prefix.</param>
    public static string GetPrefix(this Assembly assembly)
        => assembly.GetName()?.Name?.Split(".").FirstOrDefault()
           ?? throw new ArgumentException("Cannot get assembly prefix.", nameof(assembly));
}