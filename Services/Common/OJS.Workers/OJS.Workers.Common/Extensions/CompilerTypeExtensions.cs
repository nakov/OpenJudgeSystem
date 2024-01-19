namespace OJS.Workers.Common.Extensions
{
    using OJS.Workers.Common.Models;

    public static class CompilerTypeExtensions
    {
        public static string? GetFileExtension(this CompilerType compilerType)
            => compilerType switch
            {
                CompilerType.None => null,
                CompilerType.CSharpDotNetCore => "cs",
                CompilerType.CPlusPlusGcc => "cpp",
                CompilerType.Java => "java",
                _ => null,
            };
    }
}