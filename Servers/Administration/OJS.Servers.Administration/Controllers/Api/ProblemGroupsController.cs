namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using System;
using System.Linq;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Data.Pagination;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, ProblemGroupInListModel>
{
    public ProblemGroupsController(IGridDataService<ProblemGroup> problemGroupGridDataService)
        : base(problemGroupGridDataService)
    {
    }

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}