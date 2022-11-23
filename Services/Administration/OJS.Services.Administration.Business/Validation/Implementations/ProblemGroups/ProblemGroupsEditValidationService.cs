namespace OJS.Services.Administration.Business.Validation.Implementations.ProblemGroups;

using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System;
using Resource = OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemGroupsEditValidationService : IValidationService<ProblemGroupEditValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ProblemGroupsEditValidationService(INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ProblemGroupEditValidationServiceModel? problemGroup)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(problemGroup, nameof(problemGroup))
            .VerifyResult();

        if (Math.Abs(problemGroup!.ExistingOrderBy - problemGroup.NewOrderBy) > 0 && !problemGroup.ContestIsOnline)
        {
            return ValidationResult.Invalid(Resource.CanEditOrderbyOnlyInOnlineContest);
        }

        return ValidationResult.Valid();
    }
}