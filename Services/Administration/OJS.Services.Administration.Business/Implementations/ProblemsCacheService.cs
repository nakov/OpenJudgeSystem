namespace OJS.Services.Administration.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;

public class ProblemsCacheService : IProblemsCacheService
{
    private readonly ICacheService cache;

    public ProblemsCacheService(
        ICacheService cache)
        => this.cache = cache;

    public async Task ClearProblemsCacheByContestId(int contestId)
        => await this.cache.Remove(string.Format(CacheConstants.ProblemsByContestId, contestId));
}