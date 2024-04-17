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
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemResourceAdministrationModelPermissionService(
        IProblemsDataService problemsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.problemsDataService = problemsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, ProblemResourceAdministrationModel model, string operation)
    {
        var contestId = await this.problemsDataService.GetByIdQuery(model.ProblemId)
            .Select(p => p.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}