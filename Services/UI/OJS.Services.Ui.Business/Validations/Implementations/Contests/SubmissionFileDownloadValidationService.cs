namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionFileDownloadValidationService : ISubmissionFileDownloadValidationService
{
    public ValidationResult GetValidationResult((SubmissionFileDetailsServiceModel?, UserInfoModel) item)
    {
        var (submissionDetailsServiceModel, userInfoModel) = item;

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