namespace OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Services.Administration.Data;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Business.Contests.Interfaces;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ProblemsPermissionsService(
    IProblemsDataService problemsDataService,
    IContestsBusinessService contestsBusinessService)
    : PermissionsService<ProblemAdministrationModel, int>, IProblemsPermissionsService
{
    public override async Task<UserPermissionsModel> GetPermissions(UserInfoModel user, int id)
    {
        var contestId = await problemsDataService
            .GetByIdQuery(id)
            .Select(p => p.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        var hasContestPermissions = await contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);

        return (await base.GetPermissions(user, id)).WithFullAccess(hasContestPermissions);
    }
}