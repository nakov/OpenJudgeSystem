namespace OJS.Workers.Compilers;

using OJS.Workers.Common;
using OJS.Workers.Common.Models;

public interface ICompilerFactory
{
    string GetCompilerPath(CompilerType compilerType, ExecutionStrategyType strategyType);

    ICompiler CreateCompiler(CompilerType compilerType, ExecutionStrategyType strategyType);
}