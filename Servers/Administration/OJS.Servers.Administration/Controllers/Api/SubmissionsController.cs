namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models.Submissions;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Submissions;
using OJS.Services.Administration.Business.Submissions.GridData;
using OJS.Services.Administration.Business.Submissions.Validation;
using OJS.Services.Administration.Models.Submissions;
using System.Threading.Tasks;

public class SubmissionsController : BaseAdminApiController<
    Submission,
    int,
    SubmissionInListModel,
    SubmissionAdministrationServiceModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(
            ISubmissionsGridDataService submissionsGridDataService,
            ISubmissionsBusinessService submissionsBusinessService,
            SubmissionsAdministrationModelValidator validator,
            SubmissionsDeleteValidator submissionsDeleteValidator)
        : base(
            submissionsGridDataService,
            submissionsBusinessService,
            validator,
            submissionsDeleteValidator) =>
        this.submissionsBusinessService = submissionsBusinessService;

    [HttpPost("{id:int}")]
    [ProtectedEntityAction]
    public async Task<IActionResult> Retest(int id)
    {
        await this.submissionsBusinessService.Retest(id);
        return this.Ok("Submission was successfully retested.");
    }

    [HttpGet("{id:int}")]
    [ProtectedEntityAction]
    public async Task<IActionResult> Download(int id)
    {
        var submission = await this.submissionsBusinessService.Download(id);

        return this.File(
            submission.ByteContent,
            GlobalConstants.MimeTypes.ApplicationOctetStream,
            string.Format(GlobalConstants.Submissions.SubmissionDownloadFileName, id, submission.FileExtension));
    }
}