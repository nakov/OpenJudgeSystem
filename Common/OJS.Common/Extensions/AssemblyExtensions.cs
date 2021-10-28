namespace OJS.Common.Extensions
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text.RegularExpressions;

    public static class AssemblyExtensions
    {
        public static IEnumerable<Assembly> GetAllReferencedAssembliesWhereFullNameMatchesPattern(
            this Assembly assembly,
            string regexPattern)
        {
            var returnAssemblies = new List<Assembly>();
            var loadedAssemblies = new HashSet<string>();
            var assembliesToCheck = new Queue<Assembly>();

            assembliesToCheck.Enqueue(assembly);

            var regex = new Regex(regexPattern);

            while(assembliesToCheck.Any())
            {
                var assemblyToCheck = assembliesToCheck.Dequeue();

                var filteredAssemblies = assemblyToCheck
                    .GetReferencedAssemblies()
                    .Where(x => regex.IsMatch(x.FullName))
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