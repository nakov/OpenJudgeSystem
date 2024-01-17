namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Pagination;
using System;
using System.Linq;
using OJS.Services.Common.Validation;
using FluentValidation;

[ApiController]
[Route("api/[controller]")]
//TODO Replace with admin authorization
[AllowAnonymous]
public class ContestsController : ControllerBase
{
    private readonly IContestsBusinessService contestsBusinessServiceService;
    private readonly IFluentValidationService<ContestAdministrationModel> validationService;
    private readonly ContestAdministrationModelValidator validator;
    public ContestsController(
        IContestsBusinessService contestsBusinessServiceService,
        IFluentValidationService<ContestAdministrationModel> validationService,
        ContestAdministrationModelValidator validator)
    {
        this.contestsBusinessServiceService = contestsBusinessServiceService;
        this.validator = validator;
        this.validationService = validationService;
    }

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
        return this.Ok("Contest was successfully marked as deleted.");
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> Update(ContestAdministrationModel model, [FromRoute] int id)
    {
        //TODO: Note should there be check if user is admin or lecturer for the contest.
        model.Id = id;
        var validations = await this.validationService.ValidateAsync(this.validator, model);

        if (validations.Errors.Any())
        {
            return this.BadRequest(validations.Errors);
        }

        await this.contestsBusinessServiceService.Edit(model, id);

        return this.Ok("Contest was successfully updated.");
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

    // private static bool IsValidContest(ContestAdministrationModel model)
    // {
    //
    //     //TODO add validation for online contest problem groups;
    // }
}