namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using System.Linq;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class RetestSubmissionValidationService : IRetestSubmissionValidationService
{
    private readonly ISubmissionDetailsValidationService submissionDetailsValidation;

    public RetestSubmissionValidationService(ISubmissionDetailsValidationService submissionDetailsValidation)
        => this.submissionDetailsValidation = submissionDetailsValidation;

    public ValidationResult GetValidationResult((SubmissionDetailsServiceModel, UserInfoModel, bool) item)
    {
        var (detailsModel, user, isInRole) = item;
        // Checks if user is submissions participant or is admin
        var permissionsValidationResult = this.submissionDetailsValidation.GetValidationResult((detailsModel, user));

        if (!permissionsValidationResult.IsValid && !isInRole)
        {
            permissionsValidationResult.Message = ValidationMessages.Submission.NoPrivilegesForThisSubmission;

            return permissionsValidationResult;
        }

        if ((detailsModel.Tests.Any() && !detailsModel.TestRuns.Any()) &&
            detailsModel.IsProcessed && detailsModel.IsCompiledSuccessfully &&
            (detailsModel.ProcessingComment == null))
        {
            return ValidationResult.Valid();
        }

        return ValidationResult.Invalid(ValidationMessages.Submission.NotEligibleForRetest);
    }
}