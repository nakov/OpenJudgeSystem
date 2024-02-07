namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.Validators;
using OJS.Services.Administration.Models.ProblemGroups;
using System;
using System.Linq;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, int, ProblemGroupInListModel, ProblemGroupsAdministrationModel>
{
    public ProblemGroupsController(
        IGridDataService<ProblemGroup> problemGroupGridDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        ProblemGroupsAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator,
        IPermissionsService<ProblemGroupsAdministrationModel, int> permissionsService)
        : base(
            problemGroupGridDataService,
            problemGroupsBusinessService,
            validator,
            deleteValidator,
            permissionsService)
    {
    }

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}