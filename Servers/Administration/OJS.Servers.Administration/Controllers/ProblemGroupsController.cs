namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.GridData;
using OJS.Services.Administration.Business.ProblemGroups.Validators;
using OJS.Services.Administration.Models.ProblemGroups;
using System;
using System.Linq;
using OJS.Data.Models;
using OJS.Services.Common.Data;

public class ProblemGroupsController : BaseAdminApiController<ProblemGroup, int, ProblemGroupInListModel, ProblemGroupsAdministrationModel>
{
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;

    public ProblemGroupsController(
        IProblemGroupsGridDataService problemGroupGridDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        ProblemGroupAdministrationModelValidator validator,
        IDataService<AccessLog> accessLogsData)
        : base(
            problemGroupGridDataService,
            problemGroupsBusinessService,
            validator,
            accessLogsData) =>
        this.problemGroupsBusinessService = problemGroupsBusinessService;

    [HttpGet]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());

    [HttpGet("{contestId:int}")]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public IActionResult ByContestId(int contestId) =>
        this.Ok(this.problemGroupsBusinessService.GetOrderByContestId(contestId));
}