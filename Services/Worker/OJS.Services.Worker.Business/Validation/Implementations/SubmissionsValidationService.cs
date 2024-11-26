namespace OJS.Services.Worker.Business.Validation.Implementations;

using OJS.Common.Constants;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Services.Infrastructure;
using OJS.Workers.Common.Extensions;
using OJS.Workers.Common.Models;
using System.Collections.Generic;
using System.Linq;
using static OJS.Services.Worker.Business.Validation.ValidationConstants;
using ValidationResult = OJS.Services.Infrastructure.Models.ValidationResult;

public class SubmissionsValidationService : ISubmissionsValidationService
{
    public ValidationResult GetValidationResult(SubmissionServiceModel? submission)
    {
        var validationResults = new List<ValidationResult>
        {
            IsExecutionTypeValid(submission!.ExecutionType),
            IsExecutionStrategyTypeNameValid(submission.ExecutionStrategy),
        };

        if (submission.ExecutionType == ExecutionType.TestsExecution)
        {
            ValidateTestsExecution(submission.TestsExecutionDetails!, validationResults);
        }

        return CompositeValidationResult.Compose(validationResults);
    }

    private static void ValidateTestsExecution(
        TestsExecutionDetailsServiceModel? testsExecutionDetails,
        ICollection<ValidationResult> validationResults)
    {
        if (testsExecutionDetails == null)
        {
            validationResults.Add(ValidationResult.Invalid(TestsExecutionDetailsCannotBeEmpty));
        }
        else
        {
            validationResults.Add(AreTaskMaxPointsValid(testsExecutionDetails.MaxPoints));
            validationResults.Add(IsCheckerTypeValid(testsExecutionDetails.CheckerType!));
        }
    }

    private static ValidationResult IsExecutionTypeValid(ExecutionType executionType)
        => executionType == ExecutionType.NotFound
            ? ValidationResult.Invalid(ExecutionTypeNotFound)
            : ValidationResult.Valid();

    private static ValidationResult IsExecutionStrategyTypeNameValid(ExecutionStrategyType executionStrategy)
        => executionStrategy == ExecutionStrategyType.NotFound
            ? ValidationResult.Invalid(ExecutionStrategyNotFound)
            : ValidationResult.Valid();

    private static ValidationResult AreTaskMaxPointsValid(int? maxPoints)
        => maxPoints.HasValue && maxPoints.Value <= 0
            ? ValidationResult.Invalid(TaskMaxPointsMustBeMoreThanZero)
            : ValidationResult.Valid();

    private static ValidationResult IsCheckerTypeValid(string checkerType)
        => ServiceConstants.CheckerTypes
            .All
            .Contains(checkerType.ToLowerInvariant().TrimFromEnd("checker"))
            ? ValidationResult.Valid()
            : ValidationResult.Invalid(string.Format(CheckerTypeNotValidTemplate, checkerType));
}