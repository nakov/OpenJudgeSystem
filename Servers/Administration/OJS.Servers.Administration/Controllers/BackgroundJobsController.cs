namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public BackgroundJobsController(
        IHangfireBackgroundJobsService hangfireBackgroundJobsService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService)
    {
        this.hangfireBackgroundJobsService = hangfireBackgroundJobsService;
        this.submissionsForProcessingBusinessService = submissionsForProcessingBusinessService;
    }

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
}