namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Pagination;
using System.Linq;
using OJS.Services.Common.Validation;
using OJS.Common;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public class ContestsController : ControllerBase
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IFluentValidationService<ContestAdministrationModel> validationService;
    private readonly ContestAdministrationModelValidator validator;
    private readonly IUserProviderService userProvider;
    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        IFluentValidationService<ContestAdministrationModel> validationService,
        ContestAdministrationModelValidator validator,
        IUserProviderService userProvider)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.validator = validator;
        this.userProvider = userProvider;
        this.validationService = validationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.contestsBusinessService.GetAll<ContestInListModel>(model);
        return this.Ok(contest);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ContestAdministrationModel model)
    {
        var validations = await this.validationService.ValidateAsync(this.validator, model);

        if (validations.Errors.Any())
        {
            return this.BadRequest(validations.Errors);
        }

        await this.contestsBusinessService.Create(model);
        return this.Ok("Contest create successfully.");
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        if (id <= 0)
        {
            return this.BadRequest("Invalid contest id.");
        }

        await this.contestsBusinessService.Delete(id);
        return this.Ok("Contest was successfully marked as deleted.");
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> Update(ContestAdministrationModel model, [FromRoute] int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        model.Id = id;
        var validations = await this.validationService.ValidateAsync(this.validator, model);

        if (validations.Errors.Any())
        {
            return this.BadRequest(validations.Errors);
        }

        await this.contestsBusinessService.Edit(model, id);

        return this.Ok("Contest was successfully updated.");
    }

    [HttpGet]
    [Route("{id}")]
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
    [Route("Problems/{id}")]
    public async Task<IActionResult> Problems(int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        var contest = await this.contestsBusinessService.GetContestProblems(id);
        return this.Ok(contest);
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