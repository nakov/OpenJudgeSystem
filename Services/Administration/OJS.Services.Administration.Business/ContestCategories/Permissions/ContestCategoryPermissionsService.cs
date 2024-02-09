namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ContestCategoryPermissionsService
    : PermissionsService<ContestCategoryAdministrationModel, int>, IContestCategoryPermissionsService
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoryPermissionsService(IContestCategoriesDataService contestCategoriesDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    protected override async Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, int id)
    {
        var userHasCategoryPermissions = await this.contestCategoriesDataService
            .UserHasContestCategoryPermissions(id, user.Id, user.IsAdmin);

        return this.AllowFullAccessWhen(userHasCategoryPermissions, user, id);
    }
}