namespace OJS.Services.Ui.Business.Validation.Implementations;

using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Common.Models.Users;

public class SubmissionFileDownloadValidationService : ISubmissionFileDownloadValidationService
{
    public ValidationResult GetValidationResult((SubmissionDetailsServiceModel?, UserInfoModel) validationInput)
    {
        var (submissionDetailsServiceModel, userInfoModel) = validationInput;

        if (submissionDetailsServiceModel == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotFound);
        }

        if (!userInfoModel.IsAdminOrLecturer && userInfoModel.Id != submissionDetailsServiceModel.User.Id)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotMadeByUser);
        }

        if (submissionDetailsServiceModel.ByteContent == null || submissionDetailsServiceModel.ByteContent.Length == 0)
        {
            throw new BusinessServiceException(ValidationMessages.Submission.NoContentToDownload);
        }

        return ValidationResult.Valid();
    }
}