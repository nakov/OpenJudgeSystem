namespace OJS.Services.Worker.Business.ExecutionContext;

using OJS.Workers.Common.Models;
using OJS.Services.Infrastructure;

public interface ICodeTemplatesProviderService : IService
{
    string GetDefaultCodeTemplate(ExecutionStrategyType executionStrategyType);
}