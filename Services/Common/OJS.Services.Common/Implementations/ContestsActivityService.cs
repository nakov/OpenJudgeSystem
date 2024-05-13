namespace OJS.Services.Common.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;
using System.Linq;

public class ContestsActivityService : IContestsActivityService
{
    private readonly IDatesService dates;
    private readonly IParticipantsCommonDataService participantsCommonData;
    private readonly IDataService<Contest> contestsData;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly IUserProviderService userProvider;

    public ContestsActivityService(
        IDatesService dates,
        IParticipantsCommonDataService participantsCommonData,
        IDataService<Contest> contestsData,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        IUserProviderService userProvider)
    {
        this.dates = dates;
        this.participantsCommonData = participantsCommonData;
        this.contestsData = contestsData;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
    }

    public async Task<IContestActivityServiceModel> GetContestActivity(int id)
    {
        var contest = await this.contestsData.OneByIdTo<ContestForActivityServiceModel>(id);

        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest))
            .VerifyResult();

        return new ContestActivityServiceModel
        {
            Id = contest!.Id,
            Name = contest.Name,
            CanBeCompeted = this.CanUserCompete(contest),
            CanBePracticed = this.CanBePracticed(contest),
        };
    }

    public IContestActivityServiceModel GetContestActivity(IContestForActivityServiceModel contest)
        => new ContestActivityServiceModel
        {
            Id = contest.Id,
            Name = contest.Name,
            CanBePracticed = this.CanBePracticed(contest),
            CanBeCompeted = this.CanUserCompete(contest),
        };

    public ParticipantActivityServiceModel GetParticipantActivity(ParticipantForActivityServiceModel participant)
    {
        var startTime = participant.IsOfficial
            ? participant.ParticipationStartTime ?? participant.ContestStartTime
            : participant.ContestPracticeStartTime;

        var endTime = participant.IsOfficial
            ? participant.ParticipationEndTime ?? participant.ContestEndTime
            : participant.ContestPracticeEndTime;

        var hasParticipationTimeLeft = this.TimeRangeAllowsParticipation(startTime, endTime);

        return new ParticipantActivityServiceModel(
            hasParticipationTimeLeft,
            participant.IsInvalidated,
            startTime,
            endTime);
    }

    // Usage: assign value to the CanBeCompeted/Practiced properties in the different Contest models sent to the UI
    // method must be called on model/collection after retrieving it from the db
    // and before sending it to the UI as response
    public void SetCanBeCompetedAndPracticed<T>(T contestModel)
        where T : ICanBeCompetedAndPracticed
    {
        var contestActivity = this.GetContestActivity(contestModel.Id).GetAwaiter().GetResult();
        contestModel.CanBeCompeted = contestActivity.CanBeCompeted;
        contestModel.CanBePracticed = contestActivity.CanBePracticed;
    }

    public async Task<bool> IsContestActive(IContestForActivityServiceModel contest)
        => this.CanBeCompeted(contest) ||
           (contest.IsOnline &&
                await this.participantsCommonData
                    .GetAllByContestAndIsOfficial(contest.Id, true)
                    .AnyAsync(p =>
                        p.ParticipationEndTime.HasValue &&
                        p.ParticipationEndTime.Value >= this.dates.GetUtcNow()));

    public async Task<bool> IsContestActive(int contestId)
    {
        var contest = await this.contestsData.OneByIdTo<ContestForActivityServiceModel>(contestId);

        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contest, nameof(contest))
            .VerifyResult();

        return await this.IsContestActive(contest!);
    }

    private bool IsActiveParticipantInOnlineContest(int contestId)
    {
        var currentUser = this.userProvider.GetCurrentUser();
        var participants = this.participantsCommonData.GetAllByUserAndContest(currentUser.Id, contestId);
        var currentTimeInUtc = this.dates.GetUtcNow();

        return participants.Any(p =>
            p.ParticipationEndTime.HasValue &&
            p.ParticipationEndTime.Value >= currentTimeInUtc);
    }

    // Method is firstly checking if the Contest can be competed based in it's StartTime and EndTime
    // If this check returns false we have to check if the current user is a participant with remaining time
    // in an online contest
    private bool CanUserCompete(IContestForActivityServiceModel contest)
        => this.CanBeCompeted(contest) ||
           (contest.IsOnline && this.IsActiveParticipantInOnlineContest(contest.Id));

    private bool CanBeCompeted(IContestForActivityServiceModel contest)
    {
        if (!contest.IsVisible || contest.IsDeleted)
        {
            return false;
        }

        return this.TimeRangeAllowsParticipation(contest.StartTime, contest.EndTime);
    }

    private bool CanBePracticed(IContestForActivityServiceModel contest)
    {
        if (!contest.IsVisible || contest.IsDeleted)
        {
            return false;
        }

        return this.TimeRangeAllowsParticipation(contest.PracticeStartTime, contest.PracticeEndTime);
    }

    /// <summary>
    /// Checks if the given time range is valid for participation, compared to the current time in UTC.
    /// If start time is not set, participation is not possible.
    /// If end time is not set, but has start time, participation is allowed forever.
    /// </summary>
    /// <param name="startTime">Start time.</param>
    /// <param name="endTime">End time.</param>
    /// <returns>True if the time range is valid, otherwise false.</returns>
    private bool TimeRangeAllowsParticipation(DateTime? startTime, DateTime? endTime)
    {
        var utcNow = this.dates.GetUtcNow();
        return startTime <= utcNow && (endTime == null || utcNow <= endTime);
    }
}