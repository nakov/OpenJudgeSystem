namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Services.Infrastructure.BackgroundJobs;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Implementations;
using static OJS.Common.GlobalConstants.Roles;
using OJS.Servers.Administration.Infrastructure.Extensions;
using static OJS.Servers.Administration.Infrastructure.Constants;

[Authorize(Roles = Administrator)]
public class BackgroundJobsController : BaseAdminViewController
{
    private readonly IHangfireBackgroundJobsService hangfireBackgroundJobsService;
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService;

    private string queueName = ApplicationName.Administration.ToString();

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
                BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobName,
                m => m.EnqueuePendingSubmissions(),
                BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobCron,
                this.queueName);

        this.TempData.AddSuccessMessage(BackgroundJobs.JobNames.EnqueuePendingSubmissionsJobAddedMessage);

        return this.Redirect("/");
    }

    [HttpGet]
    public IActionResult AddRecurringDeletingOldSubmissionsForProcessingJob()
    {
        this.hangfireBackgroundJobsService
            .AddOrUpdateRecurringJob<SubmissionsForProcessingBusinessService>(
                BackgroundJobs.JobNames.DeleteOldSubmissionsJobName,
                m => m.DeleteProcessedSubmissions(),
                BackgroundJobs.JobNames.DeleteOldSubmissionsJobCron,
                this.queueName);

        this.TempData.AddSuccessMessage(BackgroundJobs.JobNames.DeleteOldSubmissionsJobAddedMessage);

        return this.Redirect("/");
    }
}