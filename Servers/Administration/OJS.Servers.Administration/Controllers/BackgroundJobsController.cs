namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Infrastructure.BackgroundJobs;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Implementations;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class BackgroundJobsController : BaseApiController
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

    public IActionResult AddRecurringEnqueueStaleSubmissionsForProcessingJob()
    {
        this.hangfireBackgroundJobsService
            .AddOrUpdateRecurringJob<SubmissionsForProcessingBusinessService>(
                "EnqueueStaleSubmissionsForProcessing",
                m => m.EnqueueStaleSubmissions(),
                "*/3 * * * *");

        return this.Ok();
    }
}