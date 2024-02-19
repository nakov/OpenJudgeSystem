namespace OJS.Services.Administration.Business.ProblemGroups.Permissions;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ProblemGroupUpdateModelPermissionService : IEntityPermissionsService<ProblemGroup, ProblemGroupsAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemGroupUpdateModelPermissionService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;
    public Task<bool> HasPermission(UserInfoModel user, ProblemGroupsAdministrationModel model, string operation)
        => this.contestsBusinessService.UserHasContestPermissions(model.Contest.Id, user.Id, user.IsAdmin);
}