namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Exceptions;
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
        if (model.Id is > 0)
        {
            return await this.CheckUserIsLectorInCategoryRecursively(model.Id, user.Id, user.IsAdmin);
        }

        if (operation == Create)
        {
            if (model.ParentId is > 0)
            {
                return await this.CheckUserIsLectorInCategoryRecursively(model.ParentId.Value, user.Id, user.IsAdmin);
            }

            return user.IsAdmin;
        }

        return false;
    }

    private async Task<bool> CheckUserIsLectorInCategoryRecursively(int? categoryId, string userId, bool isAdmin)
    {
        // Validate that if the recursion somehow calls itself with invalid categoryId, it will throw exception
        var currentCategory = await this.contestCategoriesDataService.GetById(categoryId);
        if (currentCategory == null)
        {
            throw new BusinessServiceException("Invalid category.");
        }

        if (isAdmin || await this.contestCategoriesDataService
            .UserHasContestCategoryPermissions(categoryId!.Value, userId, isAdmin))
        {
            return true;
        }

        if (currentCategory.ParentId == null)
        {
            return false;
        }

        return await this.CheckUserIsLectorInCategoryRecursively(
            currentCategory.ParentId.Value,
            userId,
            isAdmin);
    }
}