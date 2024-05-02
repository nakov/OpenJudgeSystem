namespace OJS.Services.Administration.Business.Validation.Implementations.ProblemGroups;

using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using Resource = OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemGroupsCreateValidationService : IValidationService<ProblemGroupCreateValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ProblemGroupsCreateValidationService(INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ProblemGroupCreateValidationServiceModel? problemGroup)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(problemGroup, nameof(problemGroup));

        if (!problemGroup!.ContestIsOnline)
        {
            return ValidationResult.Invalid(Resource.CanCreateOnlyInOnlineContest);
        }

        return problemGroup.ContestIsActive
            ? ValidationResult.Invalid(Resource.ActiveContestCannotAddProblemGroup)
            : ValidationResult.Valid();
    }
}