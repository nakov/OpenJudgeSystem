namespace OJS.Services.Infrastructure.Constants;

using Microsoft.Extensions.Logging;
using OJS.Workers.Common.Models;
using System;

public static partial class LoggerMessageDefinitions
{
    [LoggerMessage(LogLevel.Error, "Failed to get host entry for host name: {HostName}", SkipEnabledCheck = true)]
    public static partial void LogFailedToGetHostEntryForHostName(this ILogger logger, string hostName, Exception ex);

    [LoggerMessage(1, LogLevel.Error, "An error with code: {ErrorCode} and ID: {InstanceId} occurred.", SkipEnabledCheck = true)]
    public static partial void LogErrorWithCodeAndId(this ILogger logger, string? errorCode, string instanceId, Exception ex);

    // Hosted services
    [LoggerMessage(50, LogLevel.Error, "Exception in {HostedServiceName}", SkipEnabledCheck = true)]
    public static partial void LogHostedServiceException(this ILogger logger, string serviceName, Exception ex);

    [LoggerMessage(51, LogLevel.Information, "Stopping {HostedServiceName}")]
    public static partial void LogStoppingHostedService(this ILogger logger, string serviceName);

    [LoggerMessage(60, LogLevel.Information, "Background job for {JobDescription} is added or updated")]
    public static partial void LogBackgroundJobAddedOrUpdated(this ILogger logger, string jobDescription);

    // Resilience pipelines
    [LoggerMessage(100, LogLevel.Error, "Circuit breaker {CircuitBreakerState}. Total number of times {CircuitBreakerState}: {TimesChanged}. Event: {ResilienceEvent}. Outcome: [{ResilienceOutcome}]. Pipeline: {ResiliencePipeline}. Strategy: {ResilienceStrategy}.")]
    public static partial void LogCircuitBreakerStateChanged(this ILogger logger, string circuitBreakerState, int timesChanged, string resilienceEvent, string resilienceOutcome, string? resiliencePipeline, string? resilienceStrategy);

    [LoggerMessage(101, LogLevel.Information, "Circuit breaker's pipeline is being executed. Operation: {OperationKey}. Event: {ResilienceEvent}. Pipeline: {ResiliencePipeline}.")]
    public static partial void LogCircuitBreakerPipelineExecuting(this ILogger logger, string operationKey, string resilienceEvent, string? resiliencePipeline);

    [LoggerMessage(102, LogLevel.Information, "Circuit breaker's pipeline has been executed. Operation: {OperationKey}. Event: {ResilienceEvent}. Outcome: [{ResilienceOutcome}]. Pipeline: {ResiliencePipeline}.")]
    public static partial void LogCircuitBreakerPipelineExecuted(this ILogger logger, string operationKey, string resilienceEvent, string resilienceOutcome, string? resiliencePipeline);

    [LoggerMessage(103, LogLevel.Information, "Total number of retries: {ResilienceRetries}. Event: {ResilienceEvent}. Outcome: [{ResilienceOutcome}]. Pipeline: {ResiliencePipeline}. Strategy: {ResilienceStrategy}.")]
    public static partial void LogCircuitBreakerTotalRetries(this ILogger logger, int resilienceRetries, string resilienceEvent, string resilienceOutcome, string? resiliencePipeline, string? resilienceStrategy);

    // Submissions
    [LoggerMessage(1010, LogLevel.Error, "Exception in submitting submission #{SubmissionId}", SkipEnabledCheck = true)]
    public static partial void LogExceptionSubmittingSolution(this ILogger logger, int submissionId, Exception ex);

    [LoggerMessage(1020, LogLevel.Error, "Exception in submitting submissions batch.", SkipEnabledCheck = true)]
    public static partial void LogExceptionSubmittingSolutionsBatch(this ILogger logger, Exception ex);

    [LoggerMessage(1030, LogLevel.Error, "Exception returned for submission #{SubmissionId}: {@SubmissionException}", SkipEnabledCheck = true)]
    public static partial void LogExceptionReturnedForSubmission(this ILogger logger, int submissionId, ExceptionModel submissionException);

    [LoggerMessage(1040, LogLevel.Error, "Error processing execution result for submission #{SubmissionId} from worker {WorkerName}", SkipEnabledCheck = true)]
    public static partial void LogErrorProcessingExecutionResult(this ILogger logger, int submissionId, string? workerName, Exception ex);

    [LoggerMessage(1050, LogLevel.Error, "Error processing submission #{SubmissionId} on worker: {WorkerName}", SkipEnabledCheck = true)]
    public static partial void LogErrorProcessingSubmission(this ILogger logger, int submissionId, string? workerName, Exception ex);

    [LoggerMessage(1100, LogLevel.Information, "Result for submission #{SubmissionId} processed successfully with SubmissionForProcessing: {@SubmissionForProcessing}")]
    public static partial void LogSubmissionProcessedSuccessfully(this ILogger logger, int submissionId, object submissionForProcessing);

    [LoggerMessage(1101, LogLevel.Information, "Adding submission for processing: {SubmissionId}")]
    public static partial void LogAddingSubmissionForProcessing(this ILogger logger, int submissionId);

    [LoggerMessage(1102, LogLevel.Information, "Updating submission for processing: {SubmissionId}")]
    public static partial void LogUpdatingSubmissionForProcessing(this ILogger logger, int submissionId);

    [LoggerMessage(1103, LogLevel.Information, "Marking submission for processing: {SubmissionId}")]
    public static partial void LogMarkingSubmissionForProcessing(this ILogger logger, int submissionId);

    [LoggerMessage(1104, LogLevel.Information, "Marking submission as processed: {SubmissionId}")]
    public static partial void LogMarkingSubmissionAsProcessed(this ILogger logger, int submissionId);

    [LoggerMessage(1105, LogLevel.Information, "Removing submission for processing: {SubmissionId}")]
    public static partial void LogRemovingSubmissionForProcessing(this ILogger logger, int submissionId);

    [LoggerMessage(1106, LogLevel.Information, "Received retest submission #{SubmissionId}")]
    public static partial void LogReceivedRetestSubmission(this ILogger logger, int submissionId);

    [LoggerMessage(1107, LogLevel.Information, "Retested submission #{SubmissionId}")]
    public static partial void LogRetestedSubmission(this ILogger logger, int submissionId);

    [LoggerMessage(1108, LogLevel.Information, "Received execution result for submission #{SubmissionId} from worker {WorkerName}")]
    public static partial void LogReceivedExecutionResult(this ILogger logger, int submissionId, string? workerName);

    [LoggerMessage(1109, LogLevel.Information, "Starting processing execution result for submission #{SubmissionId}: {@ExecutionResult}")]
    public static partial void LogStartingProcessingExecutionResult(this ILogger logger, int submissionId, object executionResult);

    [LoggerMessage(1110, LogLevel.Information, "Processed execution result for submission #{SubmissionId} from worker {WorkerName}")]
    public static partial void LogProcessedExecutionResult(this ILogger logger, int submissionId, string? workerName);

    [LoggerMessage(1112, LogLevel.Information, "Starting processing submission #{SubmissionId} on worker {WorkerName}")]
    public static partial void LogStartingProcessingSubmission(this ILogger logger, int submissionId, string? workerName);

    [LoggerMessage(1113, LogLevel.Information, "Executing submission #{SubmissionId}: {@Submission}")]
    public static partial void LogExecutingSubmission(this ILogger logger, int submissionId, object submission);

    [LoggerMessage(1114, LogLevel.Information, "Produced execution result for submission #{SubmissionId}: {@ExecutionResult}")]
    public static partial void LogProducedExecutionResult(this ILogger logger, int submissionId, object executionResult);

    [LoggerMessage(1116, LogLevel.Information, "Published processed submission #{SubmissionId} from worker: {WorkerName}")]
    public static partial void LogPublishedProcessedSubmission(this ILogger logger, int submissionId, string? workerName);
}
