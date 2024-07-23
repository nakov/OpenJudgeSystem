namespace OJS.Servers.Infrastructure.Listeners;

using Microsoft.Extensions.Logging;
using Polly;
using Polly.Telemetry;

internal class RedisCircuitBreakerListener : TelemetryListener
{
    private readonly ILogger<ResiliencePipeline> logger;
    private int timesCircuitHasBeenOpened;
    private int timesCircuitHasBeenClosed;
    private int timesCircuitHasBeenHalfOpen;
    private int totalNumberOfRetries;
    private int totalNumberOfCacheGetCalls;

    public RedisCircuitBreakerListener(ILogger<ResiliencePipeline> logger)
        => this.logger = logger;

    public override void Write<TResult, TArgs>(in TelemetryEventArguments<TResult, TArgs> args)
    {
        var operationName = args.Context.Properties.GetValue(new ResiliencePropertyKey<string>("OperationKey"), "This value should not be null. Use an appropriate operation key!");

        var logMessage = args.Event.EventName switch
        {
            "OnCircuitOpened" => $"Circuit breaker opened. Total number of times opened: {++this.timesCircuitHasBeenOpened}. Event: {args.Event}. Outcome: {(args.Outcome.HasValue ? args.Outcome.Value : "null")} Pipeline: {args.Source.PipelineName}. Strategy: {args.Source.StrategyName}.",
            "OnCircuitClosed" => $"Circuit breaker closed. Total number of times closed: {++this.timesCircuitHasBeenClosed}. Event: {args.Event}. Outcome: {(args.Outcome.HasValue ? args.Outcome.Value : "null")} Pipeline: {args.Source.PipelineName}. Strategy: {args.Source.StrategyName}.",
            "OnCircuitHalfOpened" => $"Circuit breaker is half-open. Total number of times half-opened: {++this.timesCircuitHasBeenHalfOpen}. Event: {args.Event}. Outcome: {(args.Outcome.HasValue ? args.Outcome.Value : "null")} Pipeline: {args.Source.PipelineName}. Strategy: {args.Source.StrategyName}.",
            "PipelineExecuting" => $"Circuit breaker's pipeline is being executed. Operation: {operationName}. Number of times the get method has been called: {++this.totalNumberOfCacheGetCalls} Event: {args.Event}. Pipeline: {args.Source.PipelineName}.",
            "PipelineExecuted" => $"Circuit breaker's pipeline has been executed. Operation: {operationName} Event: {args.Event}. Outcome: {(args.Outcome.HasValue ? args.Outcome.Value : "null")} Pipeline: {args.Source.PipelineName}.",
            "OnRetry" => $"Total number of retries: {++this.totalNumberOfRetries}. Event: {args.Event}. Outcome: {(args.Outcome.HasValue ? args.Outcome.Value : "null")} Pipeline: {args.Source.PipelineName}. Strategy: {args.Source.StrategyName}.",
            _ => null,
        };

        var logLevel = args.Event.EventName switch
        {
            "OnCircuitOpened" => LogLevel.Error,
            "OnCircuitClosed" => LogLevel.Warning,
            "OnCircuitHalfOpened" => LogLevel.Warning,
            _ => LogLevel.Information,
        };

        if (logMessage is not null)
        {
            this.logger.Log(logLevel, logMessage);
        }
    }
}