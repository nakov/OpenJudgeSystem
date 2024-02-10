namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ContestIdPermissionsService : IEntityPermissionsService<Contest, int>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestIdPermissionsService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public Task<bool> HasPermission(UserInfoModel user, int id, string action)
        => this.contestsBusinessService.UserHasContestPermissions(id, user.Id, user.IsAdmin);
}