namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestDetailsValidationService : IContestDetailsValidationService
{
    public ValidationResult GetValidationResult((Contest, int?, bool) item)
    {
        var (contest, contestId, isUserAdminOrLecturerInContest) = item;

        var isUserLecturerInContest = contest != null && isUserAdminOrLecturerInContest;

        if (contest == null ||
            contest.IsDeleted ||
            ((!contest.Category!.IsVisible || !contest.IsVisible) && !isUserAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.NotFound, contestId));
        }

        return ValidationResult.Valid();
    }
}