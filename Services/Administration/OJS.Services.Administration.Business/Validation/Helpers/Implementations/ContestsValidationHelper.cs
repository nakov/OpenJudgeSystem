namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class ContestsValidationHelper : IContestsValidationHelper
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly Business.IUserProviderService userProvider;
    private readonly IContestCategoriesValidationHelper contestCategoriesValidationHelper;

    public ContestsValidationHelper(
        IContestsBusinessService contestsBusiness,
        IContestCategoriesValidationHelper contestCategoriesValidationHelper,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        Business.IUserProviderService userProvider)
    {
        this.contestsBusiness = contestsBusiness;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
        this.contestCategoriesValidationHelper = contestCategoriesValidationHelper;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId, int? categoryId)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contestId, nameof(contestId))
            .VerifyResult();

        var user = this.userProvider.GetCurrentUser();

        var userHasContestRights =
            await this.contestsBusiness.UserHasContestPermissions(
                contestId!.Value,
                categoryId,
                user.Id,
                user.IsAdmin);

        return GetValidationResult(userHasContestRights);
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId)
    {
        var user = this.userProvider.GetCurrentUser();

        return GetValidationResult(await this.contestsBusiness.UserHasContestPermissions(
            contestId!.Value,
            null,
            user.Id,
            user.IsAdmin));
    }

    private static ValidationResult GetValidationResult(bool isValid)
        => isValid
            ? ValidationResult.Valid()
            : ValidationResult.Invalid("You don't not have permissions for this contest");
}