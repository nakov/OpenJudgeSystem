namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Problems;
using OJS.Common.Exceptions;
using Microsoft.AspNetCore.Authorization;
using OJS.Common;

public class ProblemsController : ApiControllerBase
{
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IUserProviderService userProvider;

    public ProblemsController(
        IProblemsBusinessService problemsBusinessService,
        IContestsBusinessService contestsBusinessService,
        IUserProviderService userProvider)
    {
        this.problemsBusinessService = problemsBusinessService;
        this.contestsBusinessService = contestsBusinessService;
        this.userProvider = userProvider;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var problems = await this.problemsBusinessService.GetAll<ProblemsInListModel>(model);
        return this.Ok(problems);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> ById([FromRoute] int id)
    {
        if (id <= 0)
        {
            return this.BadRequest(new ExceptionResponseModel(id.ToString(), "Invalid problem id"));
        }

        var problem = await this.problemsBusinessService.ById(id);

        return this.Ok(problem);
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> Edit(ProblemAdministrationModel model)
    {
        var contest = await this.contestsBusinessService.ById(model.ContestId);

        if (contest is null)
        {
            return this.NotFound($"Cannot update problem: Contest with id {model.ContestId} not found");
        }

        if (!await this.HasContestPermission(contest.Id))
        {
            return this.Unauthorized();
        }

        await this.problemsBusinessService.Edit(model);

        return this.Ok("Problem successfully updated.");
    }

    private async Task<bool> HasContestPermission(int? contestId)
    {
        var user = this.userProvider.GetCurrentUser();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId!.Value,
            user.Id,
            user.IsAdmin);
    }
}
