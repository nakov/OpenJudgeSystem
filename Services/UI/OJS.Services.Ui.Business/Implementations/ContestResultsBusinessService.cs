namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using Data;
using Infrastructure.Exceptions;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class ContestResultsBusinessService : IContestResultsBusinessService
{
    private readonly IContestResultsAggregatorService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;
    private readonly IUserProviderService userProvider;
    private readonly ICacheService cache;

    public ContestResultsBusinessService(
        IContestResultsAggregatorService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation,
        IUserProviderService userProvider,
        ICacheService cache)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
        this.userProvider = userProvider;
        this.cache = cache;
    }

    public async Task<ContestResultsServiceModel> GetContestResults(
        int contestId,
        bool official,
        bool full,
        int? cacheSeconds = CacheConstants.TwoMinutesInSeconds)
    {
        var contest = await this.contestsData.GetByIdWithProblems(contestId);

        if (contest == null)
        {
            throw new BusinessServiceException("Contest does not exist or is deleted.");
        }

        var validationResult = this.contestResultsValidation.GetValidationResult((contest, full));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var user = this.userProvider.GetCurrentUser();

        var contestServiceModel = new ContestResultsServiceModel
        {
            Id = contest.Id,
            Name = contest.Name,
            IsCompete = official,
            ContestCanBeCompeted = contest.CanBeCompeted,
            ContestCanBePracticed = contest.CanBePracticed,
            ContestType = contest.Type,
        };

        var results = cacheSeconds.HasValue
            ? this.cache.Get(
                string.Format(CacheConstants.ContestResults, contestId, official, full),
                () => this.contestResultsAggregator.GetContestResults(
                    contestServiceModel,
                    official,
                    user.IsAdminOrLecturer,
                    full),
                cacheSeconds.Value)
            : this.cache.Get(
                string.Format(CacheConstants.ContestResults, contestId, official, full),
                () => this.contestResultsAggregator.GetContestResults(
                    contestServiceModel,
                    official,
                    user.IsAdminOrLecturer,
                    full));

        return results;
    }
}