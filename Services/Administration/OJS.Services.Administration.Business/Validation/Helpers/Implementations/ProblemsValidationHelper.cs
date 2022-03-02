namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class ProblemsValidationHelper : IProblemsValidationHelper
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ProblemsValidationHelper(
        IContestsValidationHelper contestsValidationHelper,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
    {
        this.contestsValidationHelper = contestsValidationHelper;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
    }

    public Task<ValidationResult> ValidatePermissionsOfCurrentUser(ProblemShortDetailsServiceModel? problem)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(problem, nameof(problem))
            .VerifyResult();

        return this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(problem!.ContestId);
    }
}