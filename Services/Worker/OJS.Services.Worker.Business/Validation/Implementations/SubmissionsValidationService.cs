using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Checkers;

namespace OJS.Services.Worker.Business.Validation.Implementations;

using System.Linq;
using System.Collections.Generic;
using OJS.Workers.Common.Models;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using ValidationResult = OJS.Services.Common.Models.ValidationResult;
using static ValidationConstants;

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
        TestsExecutionDetailsServiceModel testsExecutionDetails,
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
        => CheckerConstants.TypeNames.All.Contains(checkerType)
            ? ValidationResult.Valid()
            : ValidationResult.Invalid(string.Format(CheckerTypeNotValidTemplate, checkerType));
}