namespace OJS.Servers.Administration.Infrastructure;

public static class Constants
{
    public static class BackgroundJobs
    {
        public const string EnqueuePendingSubmissionsJobName = "EnqueuePendingSubmissionsForProcessing";
        public const string EnqueuePendingSubmissionsJobCron = "*/3 * * * *";
        public const string EnqueuePendingSubmissionsJobAddedMessage = $"{EnqueuePendingSubmissionsJobName} job added successfully! It will run at {EnqueuePendingSubmissionsJobCron}";
        public const string DeleteOldSubmissionsJobName = "DeleteSubmissionForProcessingOlderThanADay";
        public const string DeleteOldSubmissionsJobCron = "0 14 * * *";
        public const string DeleteOldSubmissionsJobAddedMessage = $"{DeleteOldSubmissionsJobName} job added successfully! It will run daily at {DeleteOldSubmissionsJobCron}";
    }
}