namespace OJS.Services.Worker.Business;

using OJS.Workers.Common.Models;
using SoftUni.Services.Infrastructure;

public interface IExecutionStrategySettingsProvider : IService
{
    public TSettings? GetSettings<TSettings>(ExecutionStrategyType executionStrategyType)
        where TSettings : class, IExecutionStrategySettings;
}