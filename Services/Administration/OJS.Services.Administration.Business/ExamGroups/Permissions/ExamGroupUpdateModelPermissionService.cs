namespace OJS.Services.Administration.Business.ExamGroups.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ExamGroupUpdateModelPermissionService : IEntityPermissionsService<ExamGroup, ExamGroupAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ExamGroupUpdateModelPermissionService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public Task<bool> HasPermission(UserInfoModel user, ExamGroupAdministrationModel value, string operation)
        => this.contestsBusinessService.UserHasContestPermissions(value.ContestId, user.Id, user.IsAdmin);
}