namespace OJS.Services.Common;

using FluentExtensions.Extensions;
using Hangfire;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OJS.Services.Infrastructure.BackgroundJobs;
using System;
using System.Threading;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.BackgroundJobs;

/// <summary>
/// Service that runs in the background on each app startup and registers or updates all hangfire background jobs.
/// Exits when finished registering the jobs.
/// </summary>
public class BackgroundJobsHostedService : IHostedService
{
    private const string EnqueuePendingSubmissionsCronExpression = "*/3 * * * *";
    private readonly string deleteProcessedSubmissionsCronExpression = Cron.Daily(2);
    private readonly string updatingParticipantTotalScoreSnapshotCronExpression = Cron.Daily(4);
    private readonly string removingMultipleParticipantScoresForProblemCronExpression = Cron.Daily(3);

    private readonly IHangfireBackgroundJobsService hangfireBackgroundJobs;
    private readonly ILogger<BackgroundJobsHostedService> logger;

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
            .AddOrUpdateRecurringJob<IRecurringBackgroundJobsBusinessService>(
                nameof(IRecurringBackgroundJobsBusinessService.EnqueuePendingSubmissions),
                m => m.EnqueuePendingSubmissions(),
                EnqueuePendingSubmissionsCronExpression,
                AdministrationQueueName);

        this.logger.LogInformation("Job for enqueueing pending submissions is added or updated");

        this.hangfireBackgroundJobs
            .AddOrUpdateRecurringJob<IRecurringBackgroundJobsBusinessService>(
                nameof(IRecurringBackgroundJobsBusinessService.DeleteProcessedSubmissions),
                m => m.DeleteProcessedSubmissions(),
                this.deleteProcessedSubmissionsCronExpression,
                AdministrationQueueName);

        this.logger.LogInformation("Job for deleting processed submissions is added or updated");

        this.hangfireBackgroundJobs
            .AddOrUpdateRecurringJob<IRecurringBackgroundJobsBusinessService>(
                nameof(IRecurringBackgroundJobsBusinessService.UpdateTotalScoreSnapshotOfParticipants),
                m => m.UpdateTotalScoreSnapshotOfParticipants(),
                this.updatingParticipantTotalScoreSnapshotCronExpression,
                AdministrationQueueName);

        this.logger.LogInformation("Job for updating total score snapshot of participants is added or updated");

        this.hangfireBackgroundJobs
            .AddOrUpdateRecurringJob<IRecurringBackgroundJobsBusinessService>(
                nameof(IRecurringBackgroundJobsBusinessService.RemoveParticipantMultipleScores),
                m => m.RemoveParticipantMultipleScores(),
                this.removingMultipleParticipantScoresForProblemCronExpression,
                AdministrationQueueName);

        this.logger.LogInformation("Job for removing participant multiple scores is added or updated");
    }
}