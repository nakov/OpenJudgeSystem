namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ProblemsController;

public class ContestDeleteProblemsValidationService : IContestDeleteProblemsValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ContestDeleteProblemsValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IContestsValidationHelper contestsValidationHelper)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.contestsValidationHelper = contestsValidationHelper;
    }

    public async Task<ValidationResult> GetValidationResult(ContestDeleteProblemsValidationServiceModel? contest)
    {
        var notDefaultValidationResult = this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest));

        if (!notDefaultValidationResult.IsValid)
        {
            return notDefaultValidationResult;
        }

        var contestPermissionsResult = await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contest!.Id);

        if (!contestPermissionsResult.IsValid)
        {
            return contestPermissionsResult;
        }

        return contest.IsActive
            ? ValidationResult.Invalid(Resource.Active_contest_problems_permitted_for_deletion)
            : ValidationResult.Valid();
    }
}