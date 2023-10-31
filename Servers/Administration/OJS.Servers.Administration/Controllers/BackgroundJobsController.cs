namespace OJS.Servers.Administration.Controllers;

using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Services.Infrastructure.BackgroundJobs;
using OJS.Services.Administration.Business.Implementations;
using OJS.Services.Ui.Business;
using OJS.Servers.Administration.Infrastructure.Extensions;
using static OJS.Common.GlobalConstants.Roles;
using static OJS.Servers.Administration.Infrastructure.Constants;

[Authorize(Roles = Administrator)]
public class BackgroundJobsController : BaseAdminViewController
{
    private readonly IHangfireBackgroundJobsService hangfireBackgroundJobsService;
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService;

    public BackgroundJobsController(
        IHangfireBackgroundJobsService hangfireBackgroundJobsService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService)
    {
        this.hangfireBackgroundJobsService = hangfireBackgroundJobsService;
        this.submissionsForProcessingBusinessService = submissionsForProcessingBusinessService;
    }

    [HttpGet]
    public IActionResult AddRecurringEnqueuePendingSubmissionsForProcessingJob()
    {
        this.hangfireBackgroundJobsService
            .AddOrUpdateRecurringJob<SubmissionsForProcessingBusinessService>(
                BackgroundJobs.EnqueuePendingSubmissionsJobName,
                m => m.EnqueuePendingSubmissions(),
                BackgroundJobs.EnqueuePendingSubmissionsJobCron);

        this.TempData.AddSuccessMessage(BackgroundJobs.EnqueuePendingSubmissionsJobAddedMessage);

        return this.Redirect("/");
    }

    [HttpGet]
    public IActionResult AddRecurringDeletingOldSubmissionsForProcessingJob()
    {
        this.hangfireBackgroundJobsService
            .AddOrUpdateRecurringJob<SubmissionsForProcessingBusinessService>(
                BackgroundJobs.DeleteOldSubmissionsJobName,
                m => m.DeleteProcessedSubmissions(),
                BackgroundJobs.DeleteOldSubmissionsJobCron);

        this.TempData.AddSuccessMessage(BackgroundJobs.DeleteOldSubmissionsJobAddedMessage);

        return this.Redirect("/");
    }

    [HttpGet]
    public ActionResult? RegisterJobForUpdatingParticipantTotalScoreSnapshot()
    {
        this.hangfireBackgroundJobsService.AddOrUpdateRecurringJob<IParticipantsBusinessService>(
            "UpdateTotalScoreSnapshotOfParticipants",
            p => p.UpdateTotalScoreSnapshotOfParticipants(),
            Cron.Daily(4));

        return null;
    }

    [HttpGet]
    public ActionResult? RegisterJobForRemovingMultipleParticipantScoresForProblem()
    {
        this.hangfireBackgroundJobsService.AddOrUpdateRecurringJob<IParticipantsBusinessService>(
            "RemoveParticipantMultipleScores",
            p => p.RemoveParticipantMultipleScores(),
            Cron.Daily(3));

        return null;
    }
}