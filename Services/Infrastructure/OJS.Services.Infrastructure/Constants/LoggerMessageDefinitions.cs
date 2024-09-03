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

    [LoggerMessage(1111, LogLevel.Information, "Received submission #{SubmissionId} for processing")]
    public static partial void LogReceivedSubmissionForProcessing(this ILogger logger, int submissionId);

    [LoggerMessage(1112, LogLevel.Information, "Starting processing submission #{SubmissionId} on worker {WorkerName}")]
    public static partial void LogStartingProcessingSubmission(this ILogger logger, int submissionId, string? workerName);

    [LoggerMessage(1113, LogLevel.Information, "Executing submission #{SubmissionId}: {@Submission}")]
    public static partial void LogExecutingSubmission(this ILogger logger, int submissionId, object submission);

    [LoggerMessage(1114, LogLevel.Information, "Produced execution result for submission #{SubmissionId}: {@ExecutionResult}")]
    public static partial void LogProducedExecutionResult(this ILogger logger, int submissionId, object executionResult);

    [LoggerMessage(1115, LogLevel.Information, "Publishing processed submission #{SubmissionId} from worker: {WorkerName}")]
    public static partial void LogPublishingProcessedSubmission(this ILogger logger, int submissionId, string? workerName);

    [LoggerMessage(1116, LogLevel.Information, "Published processed submission #{SubmissionId} from worker: {WorkerName}")]
    public static partial void LogPublishedProcessedSubmission(this ILogger logger, int submissionId, string? workerName);
}
