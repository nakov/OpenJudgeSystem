namespace OJS.Servers.Ui.Controllers.Api;

using System.Collections.Generic;
using OJS.Services.Ui.Business;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Infrastructure.BackgroundJobs;

public class TestController : BaseApiController
{
    private IHangfireBackgroundJobsService jobsService;

    public TestController(IHangfireBackgroundJobsService jobsService)
        => this.jobsService = jobsService;

    public void TestJobInAdminQueue()
        => this.jobsService.AddOrUpdateRecurringJob<IExamGroupsBusinessService>(
            "testjob",
            x => x.AddExternalUsersByIdAndUserIds(
                456,
                new List<string>()
                {
                    "1",
                }),
            "*/5 * * * *",
            "administration");
}