namespace OJS.Services.Administration.Business.Validation.Implementations.ExamGroups;

using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsDeleteValidationService : IValidationService<ExamGroupDeleteValidationServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ExamGroupsDeleteValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ExamGroupDeleteValidationServiceModel? examGroup)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(examGroup, nameof(examGroup))
            .VerifyResult();

        return examGroup!.ContestIsActive
            ? ValidationResult.Invalid(Resource.CannotDeleteGroupWithActiveContest)
            : ValidationResult.Valid();
    }
}