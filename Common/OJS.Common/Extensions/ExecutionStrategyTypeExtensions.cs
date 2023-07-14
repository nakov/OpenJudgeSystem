using OJS.Workers.Common.Models;

namespace OJS.Common.Extensions
{
    public static class ExecutionStrategyTypeExtensions
    {
        public static string? GetFileExtension(this ExecutionStrategyType executionStrategyType)
            => executionStrategyType switch
            {
                ExecutionStrategyType.CompileExecuteAndCheck => null, // The file extension depends on the compiler.
                ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck => "js",
                ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck => "java",
                ExecutionStrategyType.PythonExecuteAndCheck => "py",
                _ => null
            };
    }
}