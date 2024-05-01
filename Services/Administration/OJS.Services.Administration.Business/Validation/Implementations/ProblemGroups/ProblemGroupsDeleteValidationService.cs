namespace OJS.Services.Administration.Business.Validation.Implementations.ProblemGroups;

using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using Resource = OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemGroupsDeleteValidationService : IValidationService<ProblemGroupDeleteValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ProblemGroupsDeleteValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ProblemGroupDeleteValidationServiceModel? examGroup)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(examGroup, nameof(examGroup))
            .VerifyResult();

        return examGroup!.ContestIsActive
            ? ValidationResult.Invalid(Resource.ActiveContestCannotDeleteProblemGroup)
            : ValidationResult.Valid();
    }
}