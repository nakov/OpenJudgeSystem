namespace OJS.Services.Administration.Business.ProblemResources.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ProblemResourceAdministrationModelPermissionService : IEntityPermissionsService<ProblemResource, ProblemResourceAdministrationModel>
{
    private readonly IProblemResourcesDataService problemResourcesDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemResourceAdministrationModelPermissionService(
        IProblemResourcesDataService problemResourcesDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.problemResourcesDataService = problemResourcesDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, ProblemResourceAdministrationModel model, string operation)
    {
        var contestId = await this.problemResourcesDataService.GetByIdQuery(model.Id)
            .Select(pg => pg.Problem.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}