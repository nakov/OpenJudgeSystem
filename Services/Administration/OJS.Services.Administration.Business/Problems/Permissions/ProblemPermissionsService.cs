namespace OJS.Services.Administration.Business.Problems.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationActions;

public class ProblemPermissionsService : IEntityPermissionsService<Problem, int>
{
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemPermissionsService(
        IProblemsDataService problemsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.problemsDataService = problemsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string action)
    {
        int contestId;
        if (action == RestrictedByContestId)
        {
            contestId = value;
        }
        else
        {
            contestId = await this.problemsDataService
                .GetByIdQuery(value)
                .Select(p => p.ProblemGroup.ContestId)
                .FirstOrDefaultAsync();
        }

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}