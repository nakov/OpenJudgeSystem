namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemGroups;
using System;
using System.Linq;
using System.Threading.Tasks;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, int, ProblemGroupInListModel, ProblemGroupsAdministrationModel>
{
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;

    public ProblemGroupsController(
        IGridDataService<ProblemGroup> problemGroupGridDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        ProblemGroupAdministrationModelValidator validator,
        ProblemGroupAdministrationDeleteValidator deleteValidator)
        : base(
            problemGroupGridDataService,
            problemGroupsBusinessService,
            validator,
            deleteValidator) =>
        this.problemGroupsBusinessService = problemGroupsBusinessService;

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());

    [HttpGet("{contestId:int}")]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public IActionResult ByContestId(int contestId) =>
        this.Ok(this.problemGroupsBusinessService.GetOrderByContestId(contestId));
}