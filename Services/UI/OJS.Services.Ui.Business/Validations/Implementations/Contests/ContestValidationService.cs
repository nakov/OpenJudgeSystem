namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using System;
using System.Linq;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Models.Participants;
using Infrastructure;

public class ContestValidationService : IContestValidationService
{
    private readonly IDatesService datesService;
    private readonly IContestsActivityService activityService;

    public ContestValidationService(IDatesService datesService, IContestsActivityService activityService)
    {
        this.datesService = datesService;
        this.activityService = activityService;
    }

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

        var contestActivityEntity = this.activityService
            .GetContestActivity(contest.Map<ContestForActivityServiceModel>())
            .GetAwaiter()
            .GetResult();

        var participant = contest.Participants
            .FirstOrDefault(p => p.UserId == user.Id && p.IsOfficial)
            ?.Map<ParticipantServiceModel>() ?? new ParticipantServiceModel();

        if (IsContestExpired(
                contestActivityEntity,
                participant,
                user.IsAdmin,
                official,
                isUserLecturerInContest,
                this.datesService.GetUtcNow()))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.IsExpired, contest.Name));
        }

        if (contestActivityEntity.CanBeCompeted &&
            !CanUserCompeteByContestByUserAndIsAdmin(
                contestActivityEntity,
                user.IsAdmin,
                isUserLecturerInContest,
                allowToAdminAlways: true))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBeCompeted, contest.Name));
        }

        if (!official && !contestActivityEntity.CanBePracticed && !isUserLecturerInContest && !user.IsAdmin)
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBePracticed, contest.Name));
        }

        return ValidationResult.Valid();
    }

    private static bool IsContestExpired(
        IContestActivityServiceModel contest,
        ParticipantServiceModel? participant,
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

        if (participant != null)
        {
            if (official && participant.ParticipationEndTime != null)
            {
                return utcNow >= participant.ParticipationEndTime;
            }
        }

        if ((!official && !contest.CanBePracticed) ||
            (official && !contest.CanBeCompeted))
        {
            return true;
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
        IContestActivityServiceModel contest,
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