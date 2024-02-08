namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ContestCategoryPermissionsService(
    IContestCategoriesDataService contestCategoriesDataService)
    : PermissionsService<ContestCategoryAdministrationModel, int>, IContestCategoryPermissionsService
{
    protected override async Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, int id)
    {
        var userHasCategoryPermissions = await contestCategoriesDataService
            .UserHasContestCategoryPermissions(id, user.Id, user.IsAdmin);

        return this.AllowFullAccessWhen(userHasCategoryPermissions, user, id);
    }
}