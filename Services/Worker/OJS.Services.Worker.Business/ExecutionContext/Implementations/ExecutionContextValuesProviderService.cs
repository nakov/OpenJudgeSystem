namespace OJS.Services.Worker.Business.ExecutionContext.Implementations;

using OJS.Workers.Common.Models;
using Microsoft.Extensions.Options;
using OJS.Services.Worker.Models.Configuration;

public class ExecutionContextValuesProviderService : IExecutionContextValuesProviderService
{
    private readonly SubmissionExecutionConfig executionConfig;

    public ExecutionContextValuesProviderService(IOptions<SubmissionExecutionConfig> executionConfigAccessor)
        => this.executionConfig = executionConfigAccessor.Value;

    public CompilerType GetDefaultCompilerTypeByExecutionStrategyType(ExecutionStrategyType executionStrategyType)
    {
        switch (executionStrategyType)
        {
            case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
            case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
            case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                return CompilerType.CSharpDotNetCore;
            case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
            case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
            case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
            case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
            case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
            case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
            case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
            case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
            case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                return CompilerType.DotNetCompiler;
            case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
            case ExecutionStrategyType.Java17PreprocessCompileExecuteAndCheck:
                return CompilerType.Java;
            case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
            case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
            case ExecutionStrategyType.Java17ZipFileCompileExecuteAndCheck:
            case ExecutionStrategyType.Java17SpringAndHibernateProjectExecution:
                return CompilerType.JavaZip;
            case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
            case ExecutionStrategyType.Java17UnitTestsExecutionStrategy:
                return CompilerType.JavaInPlaceCompiler;
            case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                return CompilerType.CPlusPlusGcc;
            case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                return CompilerType.CPlusPlusZip;
            case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                return CompilerType.GolangCompiler;
            default:
                return CompilerType.None;
        }
    }

    public string GetDefaultAdditionalCompilerArgumentsByCompilerType(CompilerType compilerType)
    {
        switch (compilerType)
        {
            case CompilerType.CSharpDotNetCore:
                return "-nologo";

            case CompilerType.Java:
                return "-encoding utf8";

            default:
                return string.Empty;
        }
    }

    public int GetDefaultTimeLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType)
    {
        switch (executionStrategyTypeType)
        {
            case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                return this.executionConfig.TimeConfig.HtmlAndCssDefaultTimeLimitInMs;

            default:
                return this.executionConfig.TimeConfig.DefaultTimeLimitInMs;
        }
    }

    public int GetDefaultMemoryLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType)
        => this.executionConfig.MemoryConfig.DefaultMemoryLimitInBytes;
}