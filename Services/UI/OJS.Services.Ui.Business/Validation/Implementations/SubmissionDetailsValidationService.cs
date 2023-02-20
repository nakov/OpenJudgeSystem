namespace OJS.Services.Ui.Business.Validation.Implementations;

using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionDetailsValidationService : ISubmissionDetailsValidationService
{
    public ValidationResult GetValidationResult((SubmissionDetailsServiceModel?, UserInfoModel) validationInput)
    {
        var (submissionDetailsServiceModel, userInfoModel) = validationInput;

        if (userInfoModel.Id == null)
        {
            return ValidationResult.Invalid(ValidationMessages.User.NotLoggedIn, SubmissionDetailsValidation.UserNotLoggedIn.ToString());
        }

        if (submissionDetailsServiceModel == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotFound, SubmissionDetailsValidation.SubmissionNotFound.ToString());
        }

        if (!userInfoModel.IsAdminOrLecturer && userInfoModel.Id != submissionDetailsServiceModel.User.Id)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotMadeByUser, SubmissionDetailsValidation.NotAuthorOfSubmission.ToString());
        }

        return ValidationResult.Valid();
    }
}