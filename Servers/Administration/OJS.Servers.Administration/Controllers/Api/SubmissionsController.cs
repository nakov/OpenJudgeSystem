namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models.Submissions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Submissions.Permissions;
using OJS.Services.Administration.Business.Submissions.Validation;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Data.Pagination;
using System.Threading.Tasks;

public class SubmissionsController : BaseAdminApiController<
    Submission,
    SubmissionAdministrationServiceModel,
    SubmissionAdministrationServiceModel>
{
    private ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(
        IGridDataService<Submission> submissionsGridDataService,
        ISubmissionsBusinessService submissionsBusinessService,
        SubmissionsAdministrationModelValidator validator,
        SubmissionsDeleteValidator submissionsDeleteValidator,
        ISubmissionsPermissionsService submissionsPermissionsService)
        : base(
            submissionsGridDataService,
            submissionsBusinessService,
            validator,
            submissionsDeleteValidator,
            submissionsPermissionsService) =>
        this.submissionsBusinessService = submissionsBusinessService;

    [HttpPost("{id:int}")]
    public async Task<IActionResult> Retest(int id)
        => await this.submissionsBusinessService
            .Retest(id)
            .ToOkResult();

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Download(int id)
    {
        var submission = await this.submissionsBusinessService.Download(id);

        return this.File(
            submission.ByteContent,
            GlobalConstants.MimeTypes.ApplicationOctetStream,
            string.Format(GlobalConstants.Submissions.SubmissionDownloadFileName, id, submission.FileExtension));
    }
}