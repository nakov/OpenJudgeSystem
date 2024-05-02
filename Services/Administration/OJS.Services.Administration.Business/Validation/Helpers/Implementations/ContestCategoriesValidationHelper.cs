namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Common;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using System.Threading.Tasks;
using AdminResource = OJS.Common.Resources.AdministrationGeneral;

public class ContestCategoriesValidationHelper : IContestCategoriesValidationHelper
{
    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly Business.IUserProviderService userProvider;

    public ContestCategoriesValidationHelper(
        IContestCategoriesDataService contestCategoriesData,
        Business.IUserProviderService userProvider)
    {
        this.contestCategoriesData = contestCategoriesData;
        this.userProvider = userProvider;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestCategoryId)
    {
        var user = this.userProvider.GetCurrentUser();

        if (!contestCategoryId.HasValue)
        {
            return ValidationResult.Invalid(Resources.ContestsControllers.CategoryNotSelected);
        }

        var userHasPermissionsForCategory = await this.contestCategoriesData
            .UserHasContestCategoryPermissions(contestCategoryId.Value, user.Id, user.IsAdmin);

        return userHasPermissionsForCategory
            ? ValidationResult.Valid()
            : ValidationResult.Invalid(AdminResource.NoPrivilegesMessage);
    }
}