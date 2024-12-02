namespace OJS.Workers.ExecutionStrategies;

using OJS.Workers.Common;
using OJS.Workers.Common.Models;

public interface IExecutionStrategySettingsProvider
{
    TSettings? GetSettings<TSettings>(IOjsSubmission submission)
        where TSettings : class, IExecutionStrategySettings;
}