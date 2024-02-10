namespace OJS.Services.Administration.Business.ContestCategories.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

// Used with reflection
public class ContestCategoryIdPermissionsService : IEntityPermissionsService<ContestCategory, int>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoryIdPermissionsService(IContestCategoriesDataService contestCategoriesDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    public Task<bool> HasPermission(UserInfoModel user, int value, string action)
        => this.contestCategoriesDataService
            .UserHasContestCategoryPermissions(value, user.Id, user.IsAdmin);
}