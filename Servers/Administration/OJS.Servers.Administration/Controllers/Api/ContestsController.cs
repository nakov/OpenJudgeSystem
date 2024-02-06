namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.Contests.Validators;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Contests.Problems;
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
        ContestDeleteValidator deleteValidator,
        IContestPermissionsService permissionsService)
    : base(
        contestGridDataService,
        contestsBusinessService,
        validator,
        deleteValidator,
        permissionsService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.userProvider = userProvider;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllForProblem(string? searchString)
    {
        var contests =
            await this.contestsBusinessService
                .GetAllAvailableForCurrentUser<ContestCopyProblemsValidationServiceModel>(searchString ?? string.Empty);
        return this.Ok(contests);
    }
}