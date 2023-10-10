namespace OJS.Services.Common;

using FluentExtensions.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OJS.Common.Enumerations;
using OJS.Services.Infrastructure.BackgroundJobs;
using System;
using System.Threading;
using System.Threading.Tasks;
using static ServiceConstants;

public class BackgroundJobsHostedService : IHostedService
{
    private readonly IHangfireBackgroundJobsService hangfireBackgroundJobs;
    private readonly ILogger<BackgroundJobsHostedService> logger;

    private readonly string applicationQueueName = ApplicationName.Administration.ToString();

    public BackgroundJobsHostedService(
        IHangfireBackgroundJobsService hangfireBackgroundJobs,
        ILogger<BackgroundJobsHostedService> logger)
    {
        this.hangfireBackgroundJobs = hangfireBackgroundJobs;
        this.logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            this.AddOrUpdateRecurringJobs();
        }
        catch (Exception e)
        {
            this.logger.LogError("Exception in BackgroundJobsHostedService");
            this.logger.LogError(e.GetAllMessages());
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        this.logger.LogInformation("Stopping BackgroundJobsHostedService");

        return Task.CompletedTask;
    }

    private void AddOrUpdateRecurringJobs()
    {
        this.hangfireBackgroundJobs
            .AddOrUpdateRecurringJob<IHangfireBackgroundJobsBusinessService>(
                BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobName,
                m => m.EnqueuePendingSubmissionsJob(),
                BackgroundJobs.JobCrons.EnqueuePendingSubmissionsJobCron,
                this.applicationQueueName);

        this.LogJobAddedOrUpdated(
            BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobName,
            BackgroundJobs.JobCrons.EnqueuePendingSubmissionsJobCron);

        this.hangfireBackgroundJobs
            .AddOrUpdateRecurringJob<IHangfireBackgroundJobsBusinessService>(
                BackgroundJobs.JobNames.DeleteOldSubmissionsJobName,
                m => m.DeleteProcessedSubmissionsJob(),
                BackgroundJobs.JobCrons.DeleteOldSubmissionsJobCron,
                this.applicationQueueName);

        this.LogJobAddedOrUpdated(
            BackgroundJobs.JobNames.DeleteOldSubmissionsJobName,
            BackgroundJobs.JobCrons.DeleteOldSubmissionsJobCron);
    }

    private void LogJobAddedOrUpdated(string jobName, string jobCron)
        => this.logger.LogInformation($"Job {jobName} is setup to run at {jobCron} in {this.applicationQueueName} queue");
}