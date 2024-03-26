namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Data.Models.Submissions;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Submissions;
using OJS.Services.Administration.Business.Submissions.GridData;
using OJS.Services.Administration.Business.Submissions.Validation;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class SubmissionsController : BaseAdminApiController<
    Submission,
    int,
    SubmissionAdministrationServiceModel,
    SubmissionAdministrationServiceModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly ISubmissionsGridDataService submissionsGridDataService;
    private readonly ILecturerContestPrivilegesBusinessService lecturerPrivilegesBusinessService;

    public SubmissionsController(
            ISubmissionsGridDataService submissionsGridDataService,
            ISubmissionsBusinessService submissionsBusinessService,
            SubmissionsAdministrationModelValidator validator,
            IValidator<BaseDeleteValidationModel<int>> submissionsDeleteValidator,
            ILecturerContestPrivilegesBusinessService lecturerPrivilegesBusinessService)
        : base(
            submissionsGridDataService,
            submissionsBusinessService,
            validator,
            submissionsDeleteValidator)
    {
        this.submissionsBusinessService = submissionsBusinessService;
        this.submissionsGridDataService = submissionsGridDataService;
        this.lecturerPrivilegesBusinessService = lecturerPrivilegesBusinessService;
    }

    [HttpPost("{id:int}")]
    [ProtectedEntityAction]
    public async Task<IActionResult> Retest(int id)
        => await this.submissionsBusinessService
            .Retest(id)
            .ToOkResult();

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