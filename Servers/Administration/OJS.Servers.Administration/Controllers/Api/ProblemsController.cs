namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Models.Problems;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Business.Problems.Validators;
using OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Common.Exceptions;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;

public class ProblemsController : BaseAdminApiController<Problem, int, ProblemInListModel, ProblemAdministrationModel>
{
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsActivityService contestsActivityService;
    private readonly IContestsDataService contestsDataService;
    private readonly IProblemGroupsBusinessService problemGroupsBusinessService;
    private readonly IGridDataService<Problem> problemGridDataService;
    private readonly IProblemsPermissionsService permissionsService;
    private readonly IContestPermissionsService contestPermissionsService;

    public ProblemsController(
        IProblemsBusinessService problemsBusinessService,
        IProblemsDataService problemsDataService,
        IContestsActivityService contestsActivityService,
        IContestsDataService contestsDataService,
        IProblemGroupsBusinessService problemGroupsBusinessService,
        IGridDataService<Problem> problemGridDataService,
        ProblemAdministrationValidator validator,
        ProblemsDeleteValidator deleteValidator,
        IProblemsPermissionsService permissionsService,
        IContestPermissionsService contestPermissionsService)
            : base(
                problemGridDataService,
                problemsBusinessService,
                validator,
                deleteValidator,
                permissionsService)
    {
        this.problemsBusinessService = problemsBusinessService;
        this.problemsDataService = problemsDataService;
        this.contestsActivityService = contestsActivityService;
        this.contestsDataService = contestsDataService;
        this.problemGroupsBusinessService = problemGroupsBusinessService;
        this.problemGridDataService = problemGridDataService;
        this.permissionsService = permissionsService;
        this.contestPermissionsService = contestPermissionsService;
    }

    [HttpGet("{contestId:int}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        var contestPermissions = await this.contestPermissionsService.GetPermissions(this.User.Map<UserInfoModel>(), contestId);

        if (!contestPermissions.CanRead)
        {
            return this.Unauthorized();
        }

        return this.Ok(
            await this.problemGridDataService.GetAll<ProblemInListModel>(
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

        var permissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), model.Id);

        if (!permissions.HasFullAccess)
        {
            return this.Unauthorized();
        }

        await this.problemsBusinessService.RetestById(model.Id);

        return this.Ok("Problem successfully retested.");
    }

    [HttpDelete("{contestId:int}")]
    public async Task<IActionResult> DeleteAll([FromRoute] int contestId)
    {
        var contestPermissions = await this.contestPermissionsService.GetPermissions(this.User.Map<UserInfoModel>(), contestId);

        if (!contestPermissions.CanDelete)
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> DownloadAdditionalFiles([FromRoute] int id)
    {
        var permissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), id);
        if (!permissions.CanRead)
        {
            return this.Unauthorized();
        }

        if (id <= 0)
        {
            return this.UnprocessableEntity(new ExceptionResponse
            {
                Errors = new List<ExceptionResponseModel>() { new() { Name = "Id", Message = "Invalid id", }, },
            });
        }

        var file = await this.problemsBusinessService.GetAdditionalFiles(id);
        if (file == null)
        {
            return this.BadRequest();
        }

        return this.File(file.Content!, file.MimeType!, file.FileName);
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

        var user = this.User.Map<UserInfoModel>();
        var hasSourceContestPermissions = await this.contestPermissionsService.GetPermissions(user, model.SourceContestId);
        var hasDestinationContestPermissions = await this.contestPermissionsService.GetPermissions(user, model.DestinationContestId);

        if (!hasSourceContestPermissions.CanEdit || !hasDestinationContestPermissions.CanEdit)
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
}
