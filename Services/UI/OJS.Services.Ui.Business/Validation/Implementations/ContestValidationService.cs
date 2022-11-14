using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Contests;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business.Validation.Implementations;

public class ContestValidationService : IContestValidationService
{
    private readonly IContestsDataService contestsData;

    public ContestValidationService(IContestsDataService contestsData) => this.contestsData = contestsData;

    public async Task<ValidationResult> GetValidationResult((Contest, string, bool, bool) item)
    {
        var (contest, userId, isUserAdmin, official) = item;
        var isUserLecturerInContest = false;

        if (contest != null)
        {
            isUserLecturerInContest  = this.IsUserLecturerInContest(contest, userId);
        }

        if (contest == null ||
            contest.IsDeleted ||
            (!contest.IsVisible && !isUserLecturerInContest))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.NotFound, ContestValidation.ContestIsFound.ToString());
        }

        if (await this.IsContestExpired(contest.Id, userId, isUserAdmin, official))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.IsExpired, ContestValidation.ContestIsNotExpired.ToString());
        }

        if (official &&
            !await this.CanUserCompeteByContestByUserAndIsAdmin(
                contest,
                userId,
                isUserAdmin,
                allowToAdminAlways: true))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.CanBeCompeted, ContestValidation.ContestCanBeCompeted.ToString());
        }

        if (!official && !contest.CanBePracticed && !isUserLecturerInContest)
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.CanBePracticed, ContestValidation.ContestCanBePracticed.ToString());
        }

        return ValidationResult.Valid();
    }

    private bool IsUserLecturerInContest(Contest contest, string userId) =>
        contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
        contest.Category.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);

    private async Task<bool> IsContestExpired(int contestId, string userId, bool isAdmin, bool official)
    {
        var contest = await this.contestsData.GetByIdWithParticipants(contestId);
        if (contest == null)
        {
            return false;
        }

        var isUserAdminOrLecturerInContest = isAdmin || await this.contestsData
            .IsUserLecturerInByContestAndUser(contestId, userId);

        if (contest.IsOnline && !isUserAdminOrLecturerInContest)
        {
            var participant = contest.Participants.FirstOrDefault(p => p.UserId == userId && p.IsOfficial);

            if (participant == null)
            {
                if (!official && contest.PracticeEndTime.HasValue)
                {
                    return DateTime.Now > contest.PracticeEndTime;
                }

                if (official && contest.EndTime.HasValue)
                {
                    return DateTime.Now > contest.EndTime;
                }

                return false;
            }

            return participant.ParticipationEndTime >= DateTime.Now;
        }

        return false;
    }

    private async Task<bool> CanUserCompeteByContestByUserAndIsAdmin(
        Contest contest,
        string userId,
        bool isAdmin,
        bool allowToAdminAlways = false)
    {
        var isUserAdminOrLecturerInContest = isAdmin || await this.contestsData
            .IsUserLecturerInByContestAndUser(contest.Id, userId);

        if (contest.CanBeCompeted || (isUserAdminOrLecturerInContest && allowToAdminAlways))
        {
            return true;
        }

        if (isUserAdminOrLecturerInContest && contest.IsActive)
        {
            return true;
        }

        return false;
    }
}