namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypes.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Administration.Models.Validation;
using System.Threading.Tasks;

public class SubmissionTypesController : BaseAdminApiController<SubmissionType, int, SubmissionType, SubmissionTypesAdministrationModel>
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        IGridDataService<SubmissionType> submissionTypesGridDataService,
        SubmissionTypesAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator,
        IPermissionsService<SubmissionTypesAdministrationModel, int> permissionsService)
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