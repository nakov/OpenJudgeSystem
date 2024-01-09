namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Pagination;
using System;

[ApiController]
[Route("api/[controller]")]
//TODO Replace with admin authorization
[AllowAnonymous]
public class ContestsController : ControllerBase
{
    private readonly IContestsBusinessService contestsBusinessServiceService;

    public ContestsController(IContestsBusinessService contestsBusinessServiceService)
        => this.contestsBusinessServiceService = contestsBusinessServiceService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.contestsBusinessServiceService.GetAll<ContestInListModel>(model);
        return this.Ok(contest);
    }

    [HttpPost]
    [Route("create")]
    public Task<IActionResult> Create(ContestAdministrationModel model)
        => Task.FromResult<IActionResult>(this.BadRequest(new NotImplementedException()));

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        if (id <= 0)
        {
            return this.BadRequest("Invalid contest id.");
        }

        await this.contestsBusinessServiceService.Delete(id);
        return this.Ok();
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> Update(ContestAdministrationModel model)
    {
        //TODO: Note should there be check if user is admin or lecturer for the contest.
        if (!IsValidContest(model) || !model.Id.HasValue)
        {
            return this.BadRequest("Contest configuration is not valid.");
        }

        var contest = await this.contestsBusinessServiceService.Edit(model);

        return this.Ok(contest);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> ById(int id)
    {
        var contest = await this.contestsBusinessServiceService.ById(id);
        return this.Ok(contest);
    }

    [HttpGet]
    [Route("problems/{id}")]
    public async Task<IActionResult> Problems(int id)
    {
        var contest = await this.contestsBusinessServiceService.GetContestProblems(id);
        return this.Ok(contest);
    }

    private static bool IsValidContest(ContestAdministrationModel model)
    {
        var isStartTimeValid = !(model.StartTime >= model.EndTime);

        var isPracticeTimeValid = !(model.PracticeStartTime >= model.PracticeEndTime);

        var validateCategoryIsSet = !model.CategoryId.HasValue || model.CategoryId != default(int);

        //TODO add validation for online contest problem groups;

        return isStartTimeValid && isPracticeTimeValid && validateCategoryIsSet;
    }
}