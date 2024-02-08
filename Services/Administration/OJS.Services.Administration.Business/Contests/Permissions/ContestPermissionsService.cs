namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Services.Administration.Business.ContestCategories.Permissions;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestPermissionsService(
    IContestsBusinessService contestsBusinessService,
    IContestCategoryPermissionsService contestCategoryPermissionsService)
    : PermissionsService<ContestAdministrationModel, int>, IContestPermissionsService
{
    protected override async Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, int id)
    {
        var userHasContestPermissions = await contestsBusinessService.UserHasContestPermissions(id, user.Id, user.IsAdmin);
        return this.AllowFullAccessWhen(userHasContestPermissions, user, id);
    }

    protected override async Task<UserPermissionsModel> GetPermissionsForNewEntity(
        UserInfoModel user,
        ContestAdministrationModel model)
        => await contestCategoryPermissionsService.GetPermissions(user, model.CategoryId ?? 0);
}