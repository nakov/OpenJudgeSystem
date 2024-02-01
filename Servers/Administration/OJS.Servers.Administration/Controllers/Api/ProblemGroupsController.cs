namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Services.Common.Models.Pagination;
using System;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.ProblemGroups;

public class ProblemGroupsController : ApiControllerBase
{
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;

    public ProblemGroupsController(IProblemGroupsBusinessService problemGroupsBusinessService)
        => this.problemGroupsBusinessService = problemGroupsBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var problemGroups = await this.problemGroupsBusinessService.GetAll<ProblemGroupInListModel>(model);
        return this.Ok(problemGroups);
    }

    [HttpGet]
    [Route("forProblem")]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}