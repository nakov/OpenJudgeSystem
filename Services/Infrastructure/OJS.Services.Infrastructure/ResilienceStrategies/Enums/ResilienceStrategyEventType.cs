namespace OJS.Services.Infrastructure.ResilienceStrategies.Enums;

public enum ResilienceStrategyEventType
{
    OnCircuitOpened,
    OnCircuitClosed,
    OnCircuitHalfOpened,
    PipelineExecuting,
    PipelineExecuted,
    OnRetry,
}