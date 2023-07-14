namespace OJS.Services.Worker.Business.ExecutionContext;

using OJS.Workers.Common.Models;
using SoftUni.Services.Infrastructure;

public interface ICodeTemplatesProviderService : IService
{
    string GetDefaultCodeTemplate(ExecutionStrategyType executionStrategyType);
}