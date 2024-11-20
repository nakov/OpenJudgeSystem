namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class SubmissionDetailsValidationService : ISubmissionDetailsValidationService
{
    public ValidationResult GetValidationResult((SubmissionDetailsServiceModel, UserInfoModel, bool) item)
    {
        var (submission, userInfoModel, isUserAdminOrLecturerInContest) = item;

        if (!isUserAdminOrLecturerInContest && userInfoModel.Id != submission.User.Id)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotMadeByUser);
        }

        return ValidationResult.Valid();
    }
}