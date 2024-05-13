namespace OJS.Services.Worker.Business.ExecutionContext;

using OJS.Services.Infrastructure;
using OJS.Workers.Common.Models;

public interface IExecutionContextValuesProviderService : IService
{
    string GetDefaultAdditionalCompilerArgumentsByCompilerType(CompilerType compilerType);

    int GetDefaultTimeLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType);

    int GetDefaultMemoryLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType);
}
