namespace OJS.Services.Common.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
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
            CanBeCompeted = this.CanBeCompeted(contest),
            CanBePracticed = this.CanBePracticed(contest),
            IsActive = await this.IsActive(contest),
        };
    }

    public async Task<IContestActivityServiceModel> GetContestActivity(IContestForActivityServiceModel contest)
        => new ContestActivityServiceModel
        {
            Id = contest!.Id,
            Name = contest.Name,
            CanBeCompeted = this.CanBeCompeted(contest),
            CanBePracticed = this.CanBePracticed(contest),
            IsActive = await this.IsActive(contest),
        };
    public bool CanBeCompeted(IContestForActivityServiceModel contest)
    {
        if (!contest.IsVisible || contest.IsDeleted)
        {
            return false;
        }

        if (!contest.StartTime.HasValue)
        {
            // Cannot be competed
            return false;
        }

        var currentTimeInUtc = this.dates.GetUtcNow();

        if (!contest.EndTime.HasValue)
        {
            // Compete forever
            return contest.StartTime <= currentTimeInUtc;
        }

        // If the above conditional statements are not entered, first we have to check the start and end time -
        // if StartTime is before current moment and EndTime is after current moment contest CanBeCompeted.
        // If this check returns false we have to check if the current user is a participant with remaining time
        // in an online contest
        return (contest.StartTime <= currentTimeInUtc && currentTimeInUtc <= contest.EndTime) ||
               (contest.IsOnline && this.IsActiveParticipantInOnlineContest(contest.Id));
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

    public bool IsActiveParticipantInOnlineContest(int contestId)
    {
        var currentUser = this.userProvider.GetCurrentUser();
        var participants = this.participantsCommonData.GetAllByContest(contestId);

        return participants.Any(p => p.UserId == currentUser.Id &&
                                     p.ParticipationEndTime.HasValue &&
                                     p.ParticipationEndTime.Value >= this.dates.GetUtcNow());
    }

    public bool CanBePracticed(IContestForActivityServiceModel contest)
    {
        if (!contest.IsVisible || contest.IsDeleted)
        {
            return false;
        }

        var now = this.dates.GetUtcNow();

        if (!contest.PracticeStartTime.HasValue)
        {
            // Cannot be practiced
            return false;
        }

        if (!contest.PracticeEndTime.HasValue)
        {
            // Practice forever
            return contest.PracticeStartTime <= now;
        }

        return contest.PracticeStartTime <= now && now <= contest.PracticeEndTime;
    }

    public async Task<bool> IsActive(IContestForActivityServiceModel contest)
        => this.CanBeCompeted(contest) ||
           (contest.Type == ContestType.OnlinePracticalExam &&
                await this.participantsCommonData
                    .GetAllByContestAndIsOfficial(contest.Id, true)
                    .AnyAsync(p =>
                        p.ParticipationEndTime.HasValue &&
                        p.ParticipationEndTime.Value >= this.dates.GetUtcNow()));
}