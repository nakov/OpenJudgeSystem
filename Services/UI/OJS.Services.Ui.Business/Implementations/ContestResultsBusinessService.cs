namespace OJS.Services.Ui.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business.Cache;

public class ContestResultsBusinessService : IContestResultsBusinessService
{
    private readonly int itemsPerPageCompete = 100;
    private readonly int itemsPerPagePractice = 50;

    private readonly IContestResultsAggregatorCommonService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;
    private readonly IUserProviderService userProvider;
    private readonly IParticipantsDataService participantsData;
    private readonly IContestsCacheService contestsCache;
    private readonly IProblemsCacheService problemsCache;

    public ContestResultsBusinessService(
        IContestResultsAggregatorCommonService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation,
        ILecturersInContestsBusinessService lecturersInContestsBusinessService,
        IUserProviderService userProvider,
        IParticipantsDataService participantsData,
        IContestsCacheService contestsCache,
        IProblemsCacheService problemsCache)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
        this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;
        this.userProvider = userProvider;
        this.participantsData = participantsData;
        this.contestsCache = contestsCache;
        this.problemsCache = problemsCache;
    }

    public async Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool isFullResults, int page)
    {
        var contest = await this.contestsCache.GetContest(contestId).Map<Contest>()
            ?? throw new BusinessServiceException("Contest does not exist or is deleted.");

        var validationResult = this.contestResultsValidation.GetValidationResult((contest, isFullResults, official));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var user = this.userProvider.GetCurrentUser();
        var problems = (await this.problemsCache.GetByContestId(contestId).MapCollection<Problem>()).ToList();

        var contestResultsModel = new ContestResultsModel
        {
            Contest = contest,
            Problems = problems,
            CategoryId = contest.CategoryId.GetValueOrDefault(),
            Official = official,
            IsUserAdminOrLecturer = user.IsAdminOrLecturer,
            IsFullResults = isFullResults,
            TotalResultsCount = null,
            IsExportResults = false,
            ItemsPerPage = official ? this.itemsPerPageCompete : this.itemsPerPagePractice,
            Page = page,
        };

        var results = this.contestResultsAggregator.GetContestResults(contestResultsModel);

        results.UserIsInRoleForContest = await this.lecturersInContestsBusinessService.IsCurrentUserAdminOrLecturerInContest(contest.Id);

        return results;
    }

    public async Task<IEnumerable<UserPercentageResultsServiceModel?>> GetAllUserResultsPercentageByForContest(int? contestId)
    {
        if (!contestId.HasValue)
        {
            throw new BusinessServiceException(ValidationMessages.Contest.NotFound);
        }

        var contestMaxPoints = await this.contestsData.GetMaxPointsForExportById(contestId.Value);

        var participants = await this.participantsData
            .GetAllByContestWithScoresAndProblems(contestId.Value)
            .ToListAsync();

        var participantResults = participants
            .Select(participant => new
            {
                participant.UserId,
                TotalPoints = participant.Scores
                    .Where(s =>
                        !s.Problem.IsDeleted &&
                        s.Problem.ProblemGroup.ContestId == contestId.Value &&
                        s.Problem.ProblemGroup.Type != ProblemGroupType.ExcludedFromHomework)
                    .Select(s => (double?)s.Points)
                    .DefaultIfEmpty(0)
                    .Sum(),
            })
            .ToList();

        var results = participantResults
            .GroupBy(p => p.UserId)
            .Select(g => g
                .Select(p => new UserPercentageResultsServiceModel
                {
                    UserId = p.UserId,
                    ResultsInPercentages = p.TotalPoints.HasValue
                        ? p.TotalPoints.Value / contestMaxPoints * 100
                        : 0,
                })
                .MaxBy(p => p.ResultsInPercentages));

        return results;
    }
}