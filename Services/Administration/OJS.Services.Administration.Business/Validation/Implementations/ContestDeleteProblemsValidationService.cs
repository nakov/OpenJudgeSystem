namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using Resource = OJS.Common.Resources.ProblemsController;

public class ContestDeleteProblemsValidationService : IValidationService<ContestDeleteProblemsValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ContestDeleteProblemsValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ContestDeleteProblemsValidationServiceModel? contest)
    {
        var notDefaultValidationResult = this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest));

        if (!notDefaultValidationResult.IsValid)
        {
            return notDefaultValidationResult;
        }

        return contest!.IsActive
            ? ValidationResult.Invalid(Resource.ActiveContestProblemsPermittedForDeletion)
            : ValidationResult.Valid();
    }
}