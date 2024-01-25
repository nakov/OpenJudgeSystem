namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Services.Common;
using Microsoft.AspNetCore.Mvc;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Problems;
using OJS.Common.Exceptions;
using OJS.Services.Administration.Data;
using OJS.Servers.Administration.Models.Problems;
using Microsoft.EntityFrameworkCore;
using System.Linq;

public class ProblemsController : ApiControllerBase
{
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly Services.Administration.Business.IUserProviderService userProvider;
    private readonly IContestsActivityService contestsActivityService;
    private readonly IContestsDataService contestsDataService;
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;

    public ProblemsController(
        IProblemsBusinessService problemsBusinessService,
        IContestsBusinessService contestsBusinessService,
        Services.Administration.Business.IUserProviderService userProvider,
        IProblemsDataService problemsDataService,
        IContestsActivityService contestsActivityService,
        IContestsDataService contestsDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService)
    {
        this.problemsBusinessService = problemsBusinessService;
        this.contestsBusinessService = contestsBusinessService;
        this.userProvider = userProvider;
        this.problemsDataService = problemsDataService;
        this.contestsActivityService = contestsActivityService;
        this.contestsDataService = contestsDataService;
        this.problemGroupsBusinessService = problemGroupsBusinessService;
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

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var currentProblem = this.problemsDataService.GetByIdQuery(id)
            .Include(x => x.ProblemGroup)
            .ThenInclude(pg => pg.Contest)
            .FirstOrDefault();

        if (currentProblem == null)
        {
            return this.NotFound();
        }

        var contestId = currentProblem.ProblemGroup.ContestId;
        if (!await this.HasContestPermission(contestId))
        {
            return this.Unauthorized();
        }

        if (await this.contestsActivityService.IsContestActive(contestId))
        {
            return this.UnprocessableEntity("Cannot delete problem from an active contest.");
        }

        await this.problemsBusinessService.DeleteById(currentProblem.Id);

        return this.Ok("Problem successfully deleted.");
    }

    [HttpGet]
    [Route("contest/{contestId}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        if (!await this.HasContestPermission(contestId))
        {
            return this.Unauthorized();
        }

        return this.Ok(
            await this.problemsBusinessService
                .GetAll<ProblemsInListModel>(model, this.problemsDataService.GetAllByContest(contestId)));
    }

    [HttpPost]
    [Route("retest")]
    public async Task<IActionResult> Retest(ProblemRetestViewModel? model)
    {
        if (model == null || !await this.problemsDataService.ExistsById(model.Id))
        {
            return this.UnprocessableEntity();
        }

        if (!await this.HasContestPermission(model.ContestId))
        {
            return this.Unauthorized();
        }

        await this.problemsBusinessService.RetestById(model.Id);

        return this.Ok("Problem successfully retested.");
    }

    [HttpDelete]
    [Route("contest/{contestId}")]
    public async Task<IActionResult> DeleteAll([FromRoute] int contestId)
    {
        if (!await this.HasContestPermission(contestId))
        {
            return this.Unauthorized();
        }

        var contest = await this.contestsActivityService.GetContestActivity(contestId);
        if (await this.contestsActivityService.IsContestActive(contest.Id))
        {
            return this.UnprocessableEntity("Unable to delete problems for active contest.");
        }

        await this.problemsBusinessService.DeleteByContest(contest.Id);

        return this.Ok($"Problems for {contest.Name} were successfully deleted.");
    }

    [HttpPost]
    [Route("/copyAll")]
    public async Task<IActionResult> CopyAll(int sourceContestId, int destinationContestId)
    {
        var hasSourceContest = await this.contestsDataService.ExistsById(sourceContestId);
        var hasDestinationContest = await this.contestsDataService.ExistsById(destinationContestId);

        if (!hasSourceContest || !hasDestinationContest)
        {
            return this.NotFound($"Contest with id {sourceContestId} not found");
        }

        if (!await this.HasContestPermission(sourceContestId) || !await this.HasContestPermission(destinationContestId))
        {
            return this.Unauthorized();
        }

        var result = await this.problemGroupsBusinessService
            .CopyAllToContestBySourceAndDestinationContest(sourceContestId, destinationContestId);

        if (result.IsError)
        {
            return this.BadRequest($"Copy failed due to an unexpected error: {result.Error}");
        }

        return this.Ok("Problems successfully copied.");
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
