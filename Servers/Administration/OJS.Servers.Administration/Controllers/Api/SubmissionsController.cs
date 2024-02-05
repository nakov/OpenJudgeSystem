namespace OJS.Servers.Administration.Controllers.Api;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Data.Pagination;
using OJS.Servers.Infrastructure.Extensions;

public class SubmissionsController : BaseAdminApiController<Submission, SubmissionAdministrationServiceModel>
{
    private ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(
        IGridDataService<Submission> submissionsGridDataService,
        ISubmissionsBusinessService submissionsBusinessService)
        : base(submissionsGridDataService) =>
        this.submissionsBusinessService = submissionsBusinessService;

    [HttpPost("{id:int}")]
    public async Task<IActionResult> Retest([FromRoute] int id)
        => await this.submissionsBusinessService
            .Retest(id)
            .ToOkResult();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        // TODO: Check if only users with permissions for contest can delete submissions
        // if (!await this.HasContestPermission(id))
        // {
        //     return this.Unauthorized();
        // }

        if (id <= 0)
        {
            return this.UnprocessableEntity("Invalid submission id.");
        }

        await this.submissionsBusinessService.Delete(id);

        return this.Ok("Submission was successfully marked as deleted.");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Download([FromQuery] int id)
    {
        var submission = await this.submissionsBusinessService.Download(id);

        return this.File(
            submission.Content,
            GlobalConstants.MimeTypes.ApplicationOctetStream,
            string.Format(GlobalConstants.Submissions.SubmissionDownloadFileName, id, submission.FileExtension));
    }
}