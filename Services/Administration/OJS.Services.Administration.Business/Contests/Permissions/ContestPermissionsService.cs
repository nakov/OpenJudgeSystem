namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Services.Administration.Business.ContestCategories.Permissions;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestPermissionsService
    : PermissionsService<ContestAdministrationModel, int>, IContestPermissionsService
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IContestCategoryPermissionsService contestCategoryPermissionsService;

    public ContestPermissionsService(
        IContestsBusinessService contestsBusinessService,
        IContestCategoryPermissionsService contestCategoryPermissionsService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.contestCategoryPermissionsService = contestCategoryPermissionsService;
    }

    protected override async Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, int id)
    {
        var userHasContestPermissions = await this.contestsBusinessService.UserHasContestPermissions(id, user.Id, user.IsAdmin);
        return this.AllowFullAccessWhen(userHasContestPermissions, user, id);
    }

    protected override async Task<UserPermissionsModel> GetPermissionsForNewEntity(
        UserInfoModel user,
        ContestAdministrationModel model)
        => await this.contestCategoryPermissionsService.GetPermissions(user, model.CategoryId ?? 0);
}