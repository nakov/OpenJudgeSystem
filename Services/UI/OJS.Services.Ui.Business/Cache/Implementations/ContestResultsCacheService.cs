namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;

public class ContestResultsCacheService : IContestResultsCacheService
{
    private readonly ICacheService cache;
    private readonly IContestResultsBusinessService contestResultsBusiness;

    public ContestResultsCacheService(
        ICacheService cache,
        IContestResultsBusinessService contestResultsBusiness)
    {
        this.cache = cache;
        this.contestResultsBusiness = contestResultsBusiness;
    }

    public Task<ContestResultsViewModel> GetContestResults(
        int contestId,
        bool official,
        bool full,
        int? cacheSeconds = CacheConstants.TwoMinutesInSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                CacheConstants.ContestResultsSimple,
                () => this.contestResultsBusiness.GetContestResults(contestId, official, full),
                cacheSeconds.Value)
            : this.cache.Get(
                CacheConstants.ContestResultsSimple,
                () => this.contestResultsBusiness.GetContestResults(contestId, official, full));
}