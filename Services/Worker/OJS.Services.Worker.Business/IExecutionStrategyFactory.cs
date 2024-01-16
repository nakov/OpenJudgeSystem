namespace OJS.Services.Worker.Business;

using OJS.Workers.Common;
using OJS.Workers.Common.Models;
using SoftUni.Services.Infrastructure;

public interface IExecutionStrategyFactory : ISingletonService
{
    IExecutionStrategy CreateExecutionStrategy(ExecutionStrategyType type);
}