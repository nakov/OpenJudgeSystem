namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.ProblemGroups.Permissions;
using OJS.Services.Administration.Business.Problems;
using OJS.Services.Administration.Business.Problems.GridData;
using OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Services.Administration.Business.Problems.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Administration.Models.Tests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class ProblemsController : BaseAdminApiController<Problem, int, ProblemInListModel, ProblemAdministrationModel>
{
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsActivityService contestsActivityService;
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;
    private readonly IGridDataService<Problem> problemGridDataService;
    private readonly IGridDataService<ProblemResource> problemResourceGridDataService;

    public ProblemsController(
        IProblemsBusinessService problemsBusinessService,
        IProblemsDataService problemsDataService,
        IContestsActivityService contestsActivityService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        IProblemsGridDataService problemGridDataService,
        ProblemAdministrationValidator validator,
        ProblemsDeleteValidator deleteValidator,
        IGridDataService<ProblemResource> problemResourceGridDataService)
            : base(
                problemGridDataService,
                problemsBusinessService,
                validator,
                deleteValidator)
    {
        this.problemsBusinessService = problemsBusinessService;
        this.problemsDataService = problemsDataService;
        this.contestsActivityService = contestsActivityService;
        this.problemGroupsBusinessService = problemGroupsBusinessService;
        this.problemGridDataService = problemGridDataService;
        this.problemResourceGridDataService = problemResourceGridDataService;
    }

    [HttpGet("{contestId:int}")]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
        => this.Ok(
            await this.problemGridDataService.GetAll<ProblemInListModel>(
                model,
                problem => problem.ProblemGroup.ContestId == contestId));

    public override async Task<IActionResult> Create([FromForm] ProblemAdministrationModel model)
    {
        var response = await base.Create(model);
        return response;
    }

    public override async Task<IActionResult> Edit([FromForm] ProblemAdministrationModel model)
    {
        var response = await base.Edit(model);
        return response;
    }

    [HttpPost]
    [ProtectedEntityAction]
    public async Task<IActionResult> Retest(ProblemRetestViewModel? model)
    {
        if (model == null || !await this.problemsDataService.ExistsById(model.Id))
        {
            return this.UnprocessableEntity();
        }

        await this.problemsBusinessService.RetestById(model.Id);

        return this.Ok("Problem successfully retested.");
    }

    [HttpDelete("{contestId:int}")]
    [ProtectedEntityAction(typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> DeleteAll([FromRoute] int contestId)
    {
        var contest = await this.contestsActivityService.GetContestActivity(contestId);
        if (await this.contestsActivityService.IsContestActive(contest.Id))
        {
            return this.UnprocessableEntity("Unable to delete problems for active contest.");
        }

        await this.problemsBusinessService.DeleteByContest(contest.Id);

        return this.Ok($"Problems for {contest.Name} were successfully deleted.");
    }

    [HttpPost]
    [ProtectedEntityAction]
    public async Task<IActionResult> CopyAll(CopyAllToContestViewModel model)
    {
        var result = await this.problemGroupsBusinessService
            .CopyAllToContestBySourceAndDestinationContest(model.SourceContestId, model.DestinationContestId);

        if (result.IsError)
        {
            return this.BadRequest($"Copy failed due to an unexpected error: {result.Error}");
        }

        return this.Ok("Problems successfully copied.");
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetAllByName(string? searchString)
    {
        var contests =
            await this.problemsDataService
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    contest => contest.Name!.Contains(searchString ?? string.Empty))
                .MapCollection<ProblemDropdownModel>()
                .Take(20)
                .ToListAsync();

        return this.Ok(contests);
    }

    [HttpPost]
    [ProtectedEntityAction]
    public async Task<IActionResult> Copy(CopyProblemRequestModel model)
    {
        if (!await this.problemsDataService.ExistsById(model.ProblemId))
        {
            throw new BusinessServiceException($"Problem with id {model.ProblemId} does not exists.");
        }

        var result = await this.problemsBusinessService.CopyToContestByIdByContestAndProblemGroup(
            model.ProblemId,
            model.DestinationContestId,
            model.ProblemGroupId);

        if (result.IsError)
        {
            return this.BadRequest(result.Error);
        }

        return this.Ok("Successfully copied problem");
    }

    [HttpGet("{id:int}")]
    [ProtectedEntityAction("id", typeof(ProblemIdPermissionsService))]
    public async Task<IActionResult> GetResources(int id)
        => this.Ok(await this.problemResourceGridDataService
            .GetAll<ProblemResourceInListModel>(new PaginationRequestModel(), x => x.ProblemId == id));
}
