namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationOperations;

// Used with reflection
public class ContestUpdateModelPermissionsService : IEntityPermissionsService<Contest, ContestAdministrationModel>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestUpdateModelPermissionsService(
        IContestCategoriesDataService contestCategoriesDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.contestCategoriesDataService = contestCategoriesDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, ContestAdministrationModel model, string action)
    {
        if (model.Id > 0)
        {
            return await this.contestsBusinessService.UserHasContestPermissions(model.Id, user.Id, user.IsAdmin);
        }

        if (action == Create && model.CategoryId != null)
        {
            return await this.contestCategoriesDataService
                .UserHasContestCategoryPermissions(model.CategoryId.Value, user.Id, user.IsAdmin);
        }

        return true;
    }
}