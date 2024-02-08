namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models.Submissions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Submissions;
using OJS.Services.Administration.Business.Submissions.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Administration.Models.Validation;
using System.Threading.Tasks;

public class SubmissionsController : BaseAdminApiController<
    Submission,
    int,
    SubmissionAdministrationServiceModel,
    SubmissionAdministrationServiceModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(
        IGridDataService<Submission> submissionsGridDataService,
        ISubmissionsBusinessService submissionsBusinessService,
        SubmissionsAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> submissionsDeleteValidator,
        IPermissionsService<SubmissionAdministrationServiceModel, int> submissionsPermissionsService)
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