namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using System.Threading.Tasks;
using OJS.Services.Common.Models;

public class ContestsValidationHelper : IContestsValidationHelper
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IUserProviderService userProvider;

    public ContestsValidationHelper(
        IContestsBusinessService contestsBusiness,
        Business.IUserProviderService userProvider)
    {
        this.contestsBusiness = contestsBusiness;
        this.userProvider = userProvider;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId)
    {
        var user = this.userProvider.GetCurrentUser();

        return GetValidationResult(await this.contestsBusiness.UserHasContestPermissions(
            contestId!.Value,
            user.Id,
            user.IsAdmin));
    }

    private static ValidationResult GetValidationResult(bool isValid)
        => isValid
            ? ValidationResult.Valid()
            : ValidationResult.Invalid("You don't not have permissions for this contest");
}