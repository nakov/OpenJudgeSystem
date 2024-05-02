namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using System.Linq;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class RetestSubmissionValidationService : IRetestSubmissionValidationService
{
    private readonly ISubmissionDetailsValidationService submissionDetailsValidation;
    private readonly ISubmissionsHelper submissionsHelper;

    public RetestSubmissionValidationService(
        ISubmissionDetailsValidationService submissionDetailsValidation,
        ISubmissionsHelper submissionsHelper)
    {
        this.submissionDetailsValidation = submissionDetailsValidation;
        this.submissionsHelper = submissionsHelper;
    }

    public ValidationResult GetValidationResult((SubmissionDetailsServiceModel, UserInfoModel, bool) item)
    {
        var (detailsModel, user, isInRole) = item;
        // Checks if user is submissions participant or is admin/lecturer
        var permissionsValidationResult = this.submissionDetailsValidation.GetValidationResult((detailsModel, user, isInRole));

        if (!permissionsValidationResult.IsValid)
        {
            permissionsValidationResult.Message = ValidationMessages.Submission.NoPrivilegesForThisSubmission;

            return permissionsValidationResult;
        }

        if (permissionsValidationResult.IsValid || this.submissionsHelper.IsEligibleForRetest(detailsModel))
        {
            return ValidationResult.Valid();
        }

        return ValidationResult.Invalid(ValidationMessages.Submission.NotEligibleForRetest);
    }
}