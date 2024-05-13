namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public class ContestCopyProblemsValidationService : IValidationService<ContestCopyProblemsValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ContestCopyProblemsValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ContestCopyProblemsValidationServiceModel? contest)
        => this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest));
}