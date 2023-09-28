namespace OJS.Servers.Administration.Infrastructure.BackgroundJobs;

using OJS.Common.Enumerations;
using OJS.Services.Common.Models;
using OJS.Services.Administration.Business.Implementations;

public class EnqueuePendingSubmissionsForProcessingRecurringBackgroundJob : RecurringBackgroundJob<SubmissionsForProcessingBusinessService>
{
    public EnqueuePendingSubmissionsForProcessingRecurringBackgroundJob(string? queueName)
        : base(queueName ?? ApplicationName.Administration.ToString())
    {
        this.MethodCall = m => m.EnqueuePendingSubmissions();
        this.Cron = Constants.BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobCron;
    }
}