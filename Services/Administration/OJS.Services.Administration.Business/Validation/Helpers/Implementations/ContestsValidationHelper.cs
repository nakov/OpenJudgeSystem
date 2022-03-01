namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class ContestsValidationHelper : IContestsValidationHelper
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IUserProviderService userProvider;

    public ContestsValidationHelper(
        IContestsBusinessService contestsBusiness,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IUserProviderService userProvider)
    {
        this.contestsBusiness = contestsBusiness;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contestId, nameof(contestId))
            .VerifyResult();

        var user = this.userProvider.GetCurrentUser();

        return await this.contestsBusiness.UserHasContestPermissions(contestId!.Value, user.Id, user.IsAdmin)
            ? ValidationResult.Valid()
            : ValidationResult.Invalid("You don't not have permissions for this contest");
    }
}