namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestDetailsValidationService : IContestDetailsValidationService
{
    public ValidationResult GetValidationResult((Contest, int?, UserInfoModel?) item)
    {
        var (contest, contestId, user) = item;

        var isUserLecturerInContest = contest != null && user != null && user.IsLecturer;

        if (contest == null ||
            user == null ||
            contest.IsDeleted ||
            (!contest.IsVisible && !isUserLecturerInContest && !user.IsAdmin))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.NotFound, contestId));
        }

        return ValidationResult.Valid();
    }
}