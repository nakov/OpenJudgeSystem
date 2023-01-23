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
            return ValidationResult.Invalid(ValidationMessages.User.NotLoggedIn);
        }

        if (submissionDetailsServiceModel == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotFound);
        }

        if (!userInfoModel.IsAdminOrLecturer && userInfoModel.Id != submissionDetailsServiceModel.User.Id)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotMadeByUser);
        }

        return ValidationResult.Valid();
    }
}