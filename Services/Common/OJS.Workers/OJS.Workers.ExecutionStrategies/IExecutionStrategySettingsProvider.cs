namespace OJS.Workers.ExecutionStrategies;

using OJS.Workers.Common.Models;

public interface IExecutionStrategySettingsProvider
{
    public TSettings? GetSettings<TSettings>(ExecutionStrategyType type)
        where TSettings : class, IExecutionStrategySettings;
}