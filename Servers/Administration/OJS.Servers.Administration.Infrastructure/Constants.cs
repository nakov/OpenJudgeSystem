namespace OJS.Servers.Administration.Infrastructure;

public static class Constants
{
    public static class BackgroundJobs
    {
        public const string EnqueuePendingSubmissionsJobName = "EnqueuePendingSubmissionsForProcessing";
        public const string EnqueuePendingSubmissionsJobCron = "*/3 * * * *";
        public const string EnqueuePendingSubmissionsJobAddedMessage = $"{EnqueuePendingSubmissionsJobName} job added successfully! It will run at {EnqueuePendingSubmissionsJobCron}";
    }
}