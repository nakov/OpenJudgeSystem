namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using System.Linq;
using OJS.Services.Common.Validation;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Administration.Business.Validation.Validators;
using OJS.Services.Administration.Business.Contests;

public class ContestsController : BaseAdminApiController<Contest, ContestInListModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IFluentValidationService<ContestAdministrationModel> validationService;
    private readonly ContestAdministrationModelValidator validator;
    private readonly IUserProviderService userProvider;
    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        IFluentValidationService<ContestAdministrationModel> validationService,
        ContestAdministrationModelValidator validator,
        IUserProviderService userProvider,
        IGridDataService<Contest> contestGridDataService)
    : base(contestGridDataService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.validator = validator;
        this.userProvider = userProvider;
        this.validationService = validationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(ContestAdministrationModel model)
    {
        var validations = await this.validationService.ValidateAsync(this.validator, model);

        if (validations.Errors.Any())
        {
            return this.UnprocessableEntity(validations.Errors);
        }

        await this.contestsBusinessService.Create(model);
        return this.Ok("Contest create successfully.");
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        if (id <= 0)
        {
            return this.UnprocessableEntity("Invalid contest id.");
        }

        await this.contestsBusinessService.Delete(id);
        return this.Ok("Contest was successfully marked as deleted.");
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Update(ContestAdministrationModel model, [FromRoute] int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        // if (!this.ModelState.IsValid)
        // {
        //     var errors = this.ModelState.ErrorCount > 0 ?
        //         this.ModelState
        //         .Where(kvp => kvp!.Value!.Errors.Count > 0)
        //         .Select(kvp => new ExceptionResponseModel {
        //             Name = kvp.Key,
        //             Message = kvp!.Value!.Errors.Select(e => e.ErrorMessage).FirstOrDefault(),
        //         })
        //         .ToList();
        // }

        model.Id = id;
        var validations = await this.validationService.ValidateAsync(this.validator, model);

        if (validations.Errors.Any())
        {
            return this.UnprocessableEntity(validations.Errors);
        }

        await this.contestsBusinessService.Edit(model, id);

        return this.Ok("Contest was successfully updated.");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ById(int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        var contest = await this.contestsBusinessService.ById(id);
        return this.Ok(contest);
    }

    [HttpGet]
    [Route("CopyAll")]
    public async Task<IActionResult> GetAllForProblem(string? searchString)
    {
        var contests =
            await this.contestsBusinessService
                .GetAllAvailableForCurrentUser<ContestCopyProblemsValidationServiceModel>(searchString ?? string.Empty);
        return this.Ok(contests);
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