namespace OJS.Services.Worker.Business.Validation.Implementations;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OJS.Services.Worker.Models.ExecutionContext;
using OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails;
using OJS.Workers.Common.Models;

public class SubmissionsValidationService : ISubmissionsValidationService
{
    public ValidationResult GetValidationResult(SubmissionServiceModel submission)
    {
        var validationResults = new List<ValidationResult>
        {
            this.IsExecutionTypeValid(submission.ExecutionType),
            this.IsExecutionStrategyTypeNameValid(submission.ExecutionStrategyType),
        };

        if (submission.ExecutionType == ExecutionType.TestsExecution)
        {
            this.ValidateTestsExecution(submission.TestsExecutionDetails, validationResults);
        }

        return CompositeValidationResult.Compose(validationResults);
    }

    private void ValidateTestsExecution(
        TestsExecutionDetailsServiceModel testsExecutionDetails,
        ICollection<ValidationResult> validationResults)
    {
        if (testsExecutionDetails == null)
        {
            validationResults.Add(ValidationResult.Invalid(TestsExecutionDetailsCannotBeEmpty));
        }
        else
        {
            validationResults.Add(this.AreTaskMaxPointsValid(testsExecutionDetails.MaxPoints));
            validationResults.Add(this.IsCheckerTypeValid(testsExecutionDetails.CheckerType));
        }
    }

    private ValidationResult IsExecutionTypeValid(ExecutionType executionType)
        => executionType == ExecutionType.NotFound
            ? ValidationResult.Invalid(ExecutionTypeNotFound)
            : ValidationResult.Valid();

    private ValidationResult IsExecutionStrategyTypeNameValid(ExecutionStrategyType executionStrategy)
        => executionStrategy == ExecutionStrategyType.NotFound
            ? ValidationResult.Invalid(ExecutionStrategyNotFound)
            : ValidationResult.Valid();

    private ValidationResult AreTaskMaxPointsValid(int? maxPoints)
        => maxPoints.HasValue && maxPoints.Value <= 0
            ? ValidationResult.Invalid(TaskMaxPointsMustBeMoreThanZero)
            : ValidationResult.Valid();

    private ValidationResult IsCheckerTypeValid(string checkerType)
        => CheckerTypes.All.Contains(checkerType)
            ? ValidationResult.Valid()
            : ValidationResult.Invalid(string.Format(CheckerTypeNotValidTemplate, checkerType));
}

