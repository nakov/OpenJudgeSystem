namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data.Pagination;
using System.Threading.Tasks;

public class ContestsController : BaseAdminApiController<Contest, ContestInListModel, ContestAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IUserProviderService userProvider;
    public ContestsController(
        IContestsBusinessService contestsBusinessService,
        ContestAdministrationModelValidator validator,
        IUserProviderService userProvider,
        IGridDataService<Contest> contestGridDataService,
        ContestDeleteValidator deleteValidator)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator,
        deleteValidator)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.userProvider = userProvider;
    }

    public override async Task<IActionResult> Delete([FromRoute] int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        if (id <= 0)
        {
            return this.UnprocessableEntity("Invalid contest id.");
        }

        return await base.Delete(id);
    }

    public override async Task<IActionResult> Edit(ContestAdministrationModel model)
    {
        if (!await this.HasContestPermission(model.Id))
        {
            return this.Unauthorized();
        }

        return await base.Edit(model);
    }

    public override async Task<IActionResult> Get(int id)
    {
        if (!await this.HasContestPermission(id))
        {
            return this.Unauthorized();
        }

        return await base.Get(id);
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