namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.Validators;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data.Pagination;
using System;
using System.Linq;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, ProblemGroupInListModel, ProblemGroupsAdministrationModel>
{
    public ProblemGroupsController(
        IGridDataService<ProblemGroup> problemGroupGridDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        ProblemGroupsAdministrationModelValidator validator,
        ProblemGroupsDeleteValidator deleteValidator)
        : base(
            problemGroupGridDataService,
            problemGroupsBusinessService,
            validator,
            deleteValidator)
    {
    }

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}