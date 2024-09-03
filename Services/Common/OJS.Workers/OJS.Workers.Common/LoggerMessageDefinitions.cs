namespace OJS.Workers.Common;

using Microsoft.Extensions.Logging;

public static partial class LoggerMessageDefinitions
{
    [LoggerMessage(1500, LogLevel.Error, "executionStrategy.SafeDeleteDirectory has thrown an exception: {ex}", SkipEnabledCheck = true)]
    public static partial void LogSafeDeleteDirectoryException(this ILogger logger, Exception ex);

    [LoggerMessage(1600, LogLevel.Information, "Execution strategy: '{Type}' created a working directory: '{WorkingDirectory}' for submission #{SubmissionId}")]
    public static partial void LogExecutionStrategyCreatedWorkingDirectory(this ILogger logger, string type, string workingDirectory, int submissionId);
}