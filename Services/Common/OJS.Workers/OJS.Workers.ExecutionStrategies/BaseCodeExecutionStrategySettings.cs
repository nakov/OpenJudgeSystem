namespace OJS.Workers.ExecutionStrategies;

using OJS.Workers.Common.Models;

public class BaseCodeExecutionStrategySettings : IExecutionStrategySettings
{
    public int BaseTimeUsed { get; set; }

    public int BaseMemoryUsed { get; set; }
}