namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Business.Problems.Validators;
using OJS.Services.Administration.Business.Problems.Permissions;

public class ProblemsController : BaseAdminApiController<Problem, ProblemsInListModel, ProblemAdministrationModel>
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
        IProblemGroupsBusinessService problemGroupsBusinessService,
        IGridDataService<Problem> problemGridDataService,
        ProblemAdministrationValidator validator,
        ProblemsDeleteValidator deleteValidator,
        IProblemsPermissionsService permissionsService)
            : base(
                problemGridDataService,
                problemsBusinessService,
                validator,
                deleteValidator,
                permissionsService)
    {
        this.problemsBusinessService = problemsBusinessService;
        this.contestsBusinessService = contestsBusinessService;
        this.userProvider = userProvider;
        this.problemsDataService = problemsDataService;
        this.contestsActivityService = contestsActivityService;
        this.contestsDataService = contestsDataService;
        this.problemGroupsBusinessService = problemGroupsBusinessService;
    }

    [HttpGet("{contestId:int}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        if (!await this.HasContestPermission(contestId))
        {
            return this.Unauthorized();
        }

        return this.Ok(
            await this.GetWithFilter<ProblemsInListModel>(
                model,
                problem => problem.ProblemGroup.ContestId == contestId));
    }

    public override async Task<IActionResult> Create([FromForm] ProblemAdministrationModel model)
    {
        var response = await base.Create(model);
        return response;
    }

    [HttpPost]
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

    [HttpDelete("{contestId:int}")]
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
    public async Task<IActionResult> CopyAll(CopyAllToContestViewModel model)
    {
        var hasSourceContest = await this.contestsDataService.ExistsById(model.SourceContestId);
        var hasDestinationContest = await this.contestsDataService.ExistsById(model.DestinationContestId);

        if (!hasSourceContest || !hasDestinationContest)
        {
            return this.NotFound($"Contest with id {model.SourceContestId} not found");
        }

        if (!await this.HasContestPermission(model.SourceContestId) || !await this.HasContestPermission(model.DestinationContestId))
        {
            return this.Unauthorized();
        }

        var result = await this.problemGroupsBusinessService
            .CopyAllToContestBySourceAndDestinationContest(model.SourceContestId, model.DestinationContestId);

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
