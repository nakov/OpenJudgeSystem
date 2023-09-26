﻿namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using System;
using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using Infrastructure;

public class ContestValidationService : IContestValidationService
{
    private readonly IDatesService datesService;

    public ContestValidationService(IDatesService datesService) => this.datesService = datesService;

    public ValidationResult GetValidationResult((Contest?, int?, UserInfoModel?, bool) item)
    {
        var (contest, contestId, user, official) = item;

        var isUserLecturerInContest = contest != null && user != null && user.IsLecturer;

        if (contest == null ||
            user == null ||
            contest.IsDeleted ||
            (!contest.IsVisible && !isUserLecturerInContest && !user.IsAdmin))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.NotFound, contestId));
        }

        if (IsContestExpired(
                contest,
                user.Id,
                user.IsAdmin,
                official,
                isUserLecturerInContest,
                this.datesService.GetUtcNow()))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.IsExpired, contest.Name));
        }

        if (official &&
            !CanUserCompeteByContestByUserAndIsAdmin(
                contest,
                user.IsAdmin,
                isUserLecturerInContest,
                allowToAdminAlways: true))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBeCompeted, contest.Name));
        }

        if (!official && !contest.CanBePracticed && !isUserLecturerInContest && !user.IsAdmin)
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBePracticed, contest.Name));
        }

        return ValidationResult.Valid();
    }

    private static bool IsContestExpired(
        Contest contest,
        string userId,
        bool isAdmin,
        bool official,
        bool isUserLecturerInContest,
        DateTime utcNow)
    {
        var isUserAdminOrLecturerInContest = isAdmin || isUserLecturerInContest;

        if (isUserAdminOrLecturerInContest)
        {
            return false;
        }

        var participant = contest.Participants.FirstOrDefault(p => p.UserId == userId && p.IsOfficial);
        if (participant != null)
        {
            if (official && participant.ParticipationEndTime != null)
            {
                return utcNow >= participant.ParticipationEndTime;
            }
        }

        if (!official && contest.PracticeEndTime.HasValue)
        {
            return utcNow >= contest.PracticeEndTime;
        }

        if (official && contest.EndTime.HasValue)
        {
            return utcNow >= contest.EndTime;
        }

        return false;
    }

    private static bool IsAccessibleToLecturerOrAdmin(
        bool canBeCompeted,
        bool isUserAdminOrLecturerInContest,
        bool allowToAdminAlways) =>
        canBeCompeted || (isUserAdminOrLecturerInContest && allowToAdminAlways);

    private static bool CanUserCompete(bool isUserAdminOrLecturerInContest, bool isContestActive) =>
        isUserAdminOrLecturerInContest || isContestActive;

    private static bool CanUserCompeteByContestByUserAndIsAdmin(
        Contest contest,
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