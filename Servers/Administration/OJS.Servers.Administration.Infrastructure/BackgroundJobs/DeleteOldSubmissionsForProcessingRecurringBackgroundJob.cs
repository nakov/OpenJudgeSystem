namespace OJS.Servers.Administration.Infrastructure.BackgroundJobs;

using OJS.Services.Common.Models;
using OJS.Services.Administration.Business.Implementations;

public class DeleteOldSubmissionsForProcessingRecurringBackgroundJob : RecurringBackgroundJob<SubmissionsForProcessingBusinessService>
{
    protected DeleteOldSubmissionsForProcessingRecurringBackgroundJob(string queueName)
        : base(queueName)
    {
        this.MethodCall = m => m.DeleteProcessedSubmissions();
        this.Cron = Constants.BackgroundJobs.JobNames.DeleteOldSubmissionsJobCron;
    }
}