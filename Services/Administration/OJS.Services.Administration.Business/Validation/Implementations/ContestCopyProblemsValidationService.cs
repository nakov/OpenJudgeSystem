namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using System.Threading.Tasks;

public class ContestCopyProblemsValidationService : IContestCopyProblemsValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ContestCopyProblemsValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IContestsValidationHelper contestsValidationHelper)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.contestsValidationHelper = contestsValidationHelper;
    }

    public async Task<ValidationResult> GetValidationResult(ContestCopyProblemsValidationServiceModel? contest)
    {
        var notDefaultValidationResult = this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest));

        if (!notDefaultValidationResult.IsValid)
        {
            return notDefaultValidationResult;
        }

        var contestPermissionsResult = await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contest!.Id);

        return contestPermissionsResult;
    }
}