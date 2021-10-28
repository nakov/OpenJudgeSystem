namespace OJS.Common.Extensions
{
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

            var regexes = regexPatterns.Select(rp => new Regex(rp));

            while(assembliesToCheck.Any())
            {
                var assemblyToCheck = assembliesToCheck.Dequeue();

                var filteredAssemblies = assemblyToCheck
                    .GetReferencedAssemblies()
                    .Where(x => regexes.Any(r => r.IsMatch(x.FullName)))
                    .ToList();

                foreach(var reference in filteredAssemblies)
                {
                    if (loadedAssemblies.Contains(reference.FullName))
                    {
                        continue;
                    }

                    var loadedAssembly = Assembly.Load(reference);
                    assembliesToCheck.Enqueue(loadedAssembly);
                    loadedAssemblies.Add(reference.FullName);
                    returnAssemblies.Add(loadedAssembly);
                }
            }

            return returnAssemblies;
        }
    }
}