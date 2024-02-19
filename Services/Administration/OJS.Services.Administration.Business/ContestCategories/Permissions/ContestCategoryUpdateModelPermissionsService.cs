namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationOperations;

public class ContestCategoryUpdateModelPermissionsService
    : IEntityPermissionsService<ContestCategory, ContestCategoryAdministrationModel>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoryUpdateModelPermissionsService(
        IContestCategoriesDataService contestCategoriesDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    public async Task<bool> HasPermission(UserInfoModel user, ContestCategoryAdministrationModel model, string operation)
    {
        // TODO: Handle parents of parent checks recursively.
        if (model.Id is > 0)
        {
            return await this.contestCategoriesDataService
                .UserHasContestCategoryPermissions(model.Id, user.Id, user.IsAdmin);
        }

        if (operation == Create && model.ParentId is > 0)
        {
            return await this.contestCategoriesDataService
                .UserHasContestCategoryPermissions(model.ParentId.Value, user.Id, user.IsAdmin);
        }

        return false;
    }
}