namespace OJS.Services.Ui.Business.Validation.Implementations;

using System;
using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Ui.Models.Contests;

public class ContestValidationService : IContestValidationService
{
    public ValidationResult GetValidationResult((Contest?, string, bool, bool) item)
    {
        var (contest, userId, isUserAdmin, official) = item;

        var isUserLecturerInContest = contest != null && IsUserLecturerInContest(contest, userId);

        if (contest == null ||
            contest.IsDeleted ||
            (!contest.IsVisible && !isUserLecturerInContest))
        {
            return ValidationResult.Invalid(
                ValidationMessages.Contest.NotFound,
                ContestValidation.ContestIsFound.ToString());
        }

        if (IsContestExpired(contest, userId, isUserAdmin, official, isUserLecturerInContest))
        {
            return ValidationResult.Invalid(
                ValidationMessages.Contest.IsExpired,
                ContestValidation.ContestIsNotExpired.ToString());
        }

        if (official &&
            !CanUserCompeteByContestByUserAndIsAdmin(
                contest,
                userId,
                isUserAdmin,
                isUserLecturerInContest,
                allowToAdminAlways: true))
        {
            return ValidationResult.Invalid(
                ValidationMessages.Contest.CanBeCompeted,
                ContestValidation.ContestCanBeCompeted.ToString());
        }

        if (!official && !contest.CanBePracticed && !isUserLecturerInContest)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Contest.CanBePracticed,
                ContestValidation.ContestCanBePracticed.ToString());
        }

        return ValidationResult.Valid();
    }

    private static bool IsUserLecturerInContest(Contest contest, string userId) =>
        contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
        contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);

    private static bool IsContestExpired(
        Contest contest,
        string userId,
        bool isAdmin,
        bool official,
        bool isUserLecturerInContest)
    {
        var isUserAdminOrLecturerInContest = isAdmin || isUserLecturerInContest;

        if (!contest.IsOnline || isUserAdminOrLecturerInContest)
        {
            return false;
        }

        var participant = contest.Participants.FirstOrDefault(p => p.UserId == userId && p.IsOfficial);
        if (participant != null)
        {
            if (participant.ParticipationEndTime != null)
            {
                return DateTime.Now >= participant.ParticipationEndTime;
            }
        }

        if (!official && contest.PracticeEndTime.HasValue)
        {
            return DateTime.Now >= contest.PracticeEndTime;
        }

        if (official && contest.EndTime.HasValue)
        {
            return DateTime.Now >= contest.EndTime;
        }

        return false;
    }

    private static bool IsAccessibleToLecturerOrAdmin(
        bool canBeCompeted,
        bool isUserAdminOrLecturerInContest,
        bool allowToAdminAlways) =>
        canBeCompeted || (isUserAdminOrLecturerInContest && allowToAdminAlways);

    private static bool CanUserCompete(bool isUserAdminOrLecturerInContest, bool isContestActive) =>
        isUserAdminOrLecturerInContest && isContestActive;

    private static bool CanUserCompeteByContestByUserAndIsAdmin(
        Contest contest,
        string userId,
        bool isAdmin,
        bool isUserLecturerInContest = true,
        bool allowToAdminAlways = false)
    {
        var isUserAdminOrLecturerInContest = isAdmin || isUserLecturerInContest;

        return IsAccessibleToLecturerOrAdmin(
                   contest.CanBeCompeted,
                   isUserAdminOrLecturerInContest,
                   allowToAdminAlways)
               || CanUserCompete(isUserAdminOrLecturerInContest, contest.IsActive);
    }
}