namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ContestCategoryPermissionsService : IEntityPermissionsService<ContestCategory, int>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoryPermissionsService(IContestCategoriesDataService contestCategoriesDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    public Task<bool> HasPermission(UserInfoModel user, int value, string action)
        => this.contestCategoriesDataService
            .UserHasContestCategoryPermissions(value, user.Id, user.IsAdmin);
}