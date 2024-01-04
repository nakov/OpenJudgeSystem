namespace OJS.Workers.Compilers;

using OJS.Workers.Common;
using OJS.Workers.Common.Models;

public interface ICompilerFactory
{
    string GetCompilerPath(CompilerType type);

    ICompiler CreateCompiler(
        CompilerType compilerType,
        ExecutionStrategyType type = ExecutionStrategyType.DoNothing);
}