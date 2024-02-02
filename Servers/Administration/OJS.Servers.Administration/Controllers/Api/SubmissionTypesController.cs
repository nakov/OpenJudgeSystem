namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypes.Permissions;
using OJS.Services.Administration.Business.SubmissionTypes.Validators;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Common.Data.Pagination;
using System.Threading.Tasks;

public class SubmissionTypesController : BaseAdminApiController<SubmissionType, SubmissionType, SubmissionTypesAdministrationModel>
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        IGridDataService<SubmissionType> submissionTypesGridDataService,
        SubmissionTypesAdministrationModelValidator validator,
        SubmissionTypesDeleteValidator deleteValidator,
        ISubmissionTypesPermissionsService permissionsService)
            : base(
                submissionTypesGridDataService,
                submissionTypesBusinessService,
                validator,
                deleteValidator,
                permissionsService) =>
        this.submissionTypesBusinessService = submissionTypesBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetForProblem()
        => this.Ok(await this.submissionTypesBusinessService.GetForProblem());
}