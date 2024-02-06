namespace OJS.Services.Worker.Business.ExecutionContext.Implementations;

using OJS.Workers.Common.Models;
using Microsoft.Extensions.Options;
using OJS.Services.Worker.Models.Configuration;

public class ExecutionContextValuesProviderService : IExecutionContextValuesProviderService
{
    private readonly SubmissionExecutionConfig executionConfig;

    public ExecutionContextValuesProviderService(IOptions<SubmissionExecutionConfig> executionConfigAccessor)
        => this.executionConfig = executionConfigAccessor.Value;

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