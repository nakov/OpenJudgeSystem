namespace OJS.Services.Worker.Business.ExecutionContext;

using SoftUni.Services.Infrastructure;
using OJS.Workers.Common.Models;

public interface IExecutionContextValuesProviderService : IService
{
    CompilerType GetDefaultCompilerTypeByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType);

    string GetDefaultAdditionalCompilerArgumentsByCompilerType(CompilerType compilerType);

    int GetDefaultTimeLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType);

    int GetDefaultMemoryLimitByExecutionStrategyType(ExecutionStrategyType executionStrategyTypeType);
}
