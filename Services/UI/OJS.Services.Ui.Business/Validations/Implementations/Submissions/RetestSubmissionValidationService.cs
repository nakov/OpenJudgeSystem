namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using System.Threading.Tasks;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class RetestSubmissionValidationService(ISubmissionsHelper submissionsHelper)
    : IRetestSubmissionValidationService
{
    public async Task<ValidationResult> GetValidationResult((SubmissionForRetestServiceModel, UserInfoModel, bool) item)
    {
        var (submission, user, isAdminOrLecturerInContest) = item;

        if (!isAdminOrLecturerInContest && user.Id != submission.UserId)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NoPrivilegesForThisSubmission);
        }

        var isEligibleForRetest = await submissionsHelper.IsEligibleForRetest(
            submission.Id,
            submission.Processed,
            submission.IsCompiledSuccessfully,
            submission.TestRunsCount);

        if (!isAdminOrLecturerInContest && !isEligibleForRetest)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.NotEligibleForRetest);
        }

        return ValidationResult.Valid();
    }
}