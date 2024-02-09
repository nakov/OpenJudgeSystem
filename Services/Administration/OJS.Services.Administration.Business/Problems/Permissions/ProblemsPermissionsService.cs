namespace OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Services.Administration.Data;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ProblemsPermissionsService
    : PermissionsService<ProblemAdministrationModel, int>, IProblemsPermissionsService
{
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemsPermissionsService(
        IProblemsDataService problemsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.problemsDataService = problemsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    protected override async Task<UserPermissionsModel> GetPermissionsForNewEntity(UserInfoModel user, ProblemAdministrationModel model)
        => (await this.GetPermissions(user, model))
            .WithFullAccess(
                allow: await this.contestsBusinessService.UserHasContestPermissions(
                    model.ContestId,
                    user.Id,
                    user.IsAdmin));

    protected override async Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, int id)
    {
        var contestId = await this.problemsDataService
            .GetByIdQuery(id)
            .Select(p => p.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        var hasContestPermissions = await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);

        return (await this.GetPermissions(user, id)).WithFullAccess(hasContestPermissions);
    }
}