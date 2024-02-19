namespace OJS.Services.Administration.Business.ProblemGroups.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ProblemGroupIdPermissionService : IEntityPermissionsService<ProblemGroup, int>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IProblemGroupsDataService problemGroupsDataService;

    public ProblemGroupIdPermissionService(
        IContestsBusinessService contestsBusinessService,
        IProblemGroupsDataService problemGroupsDataService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.problemGroupsDataService = problemGroupsDataService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string action)
    {
        var contestId = await this.problemGroupsDataService
            .GetByIdQuery(value)
            .Select(pg => pg.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}