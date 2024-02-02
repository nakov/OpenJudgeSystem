namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using System;
using System.Linq;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.Validators;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, ProblemGroupInListModel, ProblemGroupsAdministrationModel>
{
    public ProblemGroupsController(
        IGridDataService<ProblemGroup> problemGroupGridDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        ProblemGroupsAdministrationModelValidator validator)
        : base(
            problemGroupGridDataService,
            problemGroupsBusinessService,
            validator)
    {
    }

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}