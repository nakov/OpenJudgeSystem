namespace OJS.Services.Infrastructure.ResilienceStrategies.Listeners;

using Microsoft.Extensions.Logging;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.ResilienceStrategies.Enums;
using Polly;
using Polly.Telemetry;
using System;
using System.Collections;
using System.Threading;
using static OJS.Services.Infrastructure.Constants.ResilienceStrategyConstants.Common;

public class RedisCircuitBreakerListener : TelemetryListener
{
    private readonly ILogger<ResiliencePipeline> logger;

    private int circuitOpenedCount;
    private int circuitClosedCount;
    private int circuitHalfOpenCount;
    private int retryCount;

    public RedisCircuitBreakerListener(ILogger<ResiliencePipeline> logger)
        => this.logger = logger;

    public override void Write<TResult, TArgs>(in TelemetryEventArguments<TResult, TArgs> args)
    {
        if (!Enum.TryParse<ResilienceStrategyEventType>(args.Event.EventName, out var eventType))
        {
            return;
        }

        var arguments = args;
        Action logAction = eventType switch
        {
            ResilienceStrategyEventType.OnCircuitOpened => () => this.LogCircuitStateChange("opened", GetOutcomeResult(arguments), ref this.circuitOpenedCount, arguments),
            ResilienceStrategyEventType.OnCircuitClosed => () => this.LogCircuitStateChange("closed", GetOutcomeResult(arguments), ref this.circuitClosedCount, arguments),
            ResilienceStrategyEventType.OnCircuitHalfOpened => () => this.LogCircuitStateChange("half-opened", GetOutcomeResult(arguments), ref this.circuitHalfOpenCount, arguments),
            ResilienceStrategyEventType.PipelineExecuting => () => this.LogPipelineExecution(arguments),
            ResilienceStrategyEventType.PipelineExecuted => () => this.LogPipelineExecuted(GetOutcomeResult(arguments), arguments),
            ResilienceStrategyEventType.OnRetry => () => this.LogRetry(GetOutcomeResult(arguments), arguments),
            _ => () => { }
            ,
        };

        logAction();
    }

    private static string GetOutcomeResult<TResult, TArgs>(in TelemetryEventArguments<TResult, TArgs> args)
    {
        if (!args.Outcome.HasValue)
        {
            return "No result.";
        }

        if (args.Outcome.Value.Exception is not null)
        {
            return $"Exception - {args.Outcome.Value.Exception.Message}";
        }

        var resultType = typeof(TResult);
        return typeof(IEnumerable).IsAssignableFrom(resultType) && resultType != typeof(string)
            ? $"Collection of {resultType.GetGenericArguments()[0].Name}"
            : resultType.Name;
    }

    private static string GetOperationKey<TResult, TArgs>(in TelemetryEventArguments<TResult, TArgs> args)
        => args.Context.Properties.GetValue(new ResiliencePropertyKey<string>(OperationKey), "This value should not be null. Use an appropriate operation key!");

    private void LogCircuitStateChange<TResult, TArgs>(string state, string outcomeResult, ref int count, in TelemetryEventArguments<TResult, TArgs> args)
        => this.logger.LogCircuitBreakerStateChanged(
            state,
            Interlocked.Increment(ref count),
            args.Event.ToString(),
            outcomeResult,
            args.Source.PipelineName,
            args.Source.StrategyName);

    private void LogPipelineExecution<TResult, TArgs>(in TelemetryEventArguments<TResult, TArgs> args)
        => this.logger.LogCircuitBreakerPipelineExecuting(GetOperationKey(args), args.Event.ToString(), args.Source.PipelineName);

    private void LogPipelineExecuted<TResult, TArgs>(string outcomeResult, in TelemetryEventArguments<TResult, TArgs> args)
        => this.logger.LogCircuitBreakerPipelineExecuted(GetOperationKey(args), args.Event.ToString(), outcomeResult, args.Source.PipelineName);

    private void LogRetry<TResult, TArgs>(string outcomeResult, in TelemetryEventArguments<TResult, TArgs> args)
        => this.logger.LogCircuitBreakerTotalRetries(this.retryCount++, args.Event.ToString(), outcomeResult, args.Source.PipelineName, args.Source.StrategyName);
}