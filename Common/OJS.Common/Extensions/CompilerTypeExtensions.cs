namespace OJS.Common.Extensions
{
    using SoftUni.Judge.Common.Enumerations;

    public static class CompilerTypeExtensions
    {
        public static string? GetFileExtension(this CompilerType compilerType)
            => compilerType switch
            {
                CompilerType.None => null,
                CompilerType.CSharp => "cs",
                CompilerType.MsBuild => "zip",
                CompilerType.CPlusPlusGcc => "cpp",
                CompilerType.Java => "java",
                _ => null
            };
    }
}