namespace OJS.Common.Extensions.Strings
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;

    public static class StringCollectionExtensions
    {
        public static IEnumerable<Type> GetExportedTypes(this IEnumerable<string> assemblyNames)
            => assemblyNames
                .Select(a =>
                {
                    try
                    {
                        return Assembly.Load(new AssemblyName(a));
                    }
                    catch
                    {
                        return null;
                    }
                })
                .Where(assembly => assembly != null)
                .SelectMany(a => a.ExportedTypes);
    }
}