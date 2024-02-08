﻿namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.SubmissionsForProcessing;
using OJS.Services.Administration.Business.SubmissionsForProcessing.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Administration.Models.Validation;

public class SubmissionsForProcessingController : BaseAdminApiController<
    SubmissionForProcessing,
    int,
    SubmissionsForProcessingAdministrationServiceModel,
    SubmissionsForProcessingAdministrationServiceModel>
{
    public SubmissionsForProcessingController(
        IGridDataService<SubmissionForProcessing> submissionsGridDataService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService,
        SubmissionsForProcessingAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> submissionsForProcessingDeleteValidator,
        IPermissionsService<SubmissionsForProcessingAdministrationServiceModel, int> submissionsPermissionsService)
        : base(
            submissionsGridDataService,
            submissionsForProcessingBusinessService,
            validator,
            submissionsForProcessingDeleteValidator,
            submissionsPermissionsService)
    {
    }
}