namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;

public class ContestsCacheService : IContestsCacheService
{
    private readonly ICacheService cache;

    public ContestsCacheService(
        ICacheService cache)
        => this.cache = cache;

    public async Task ClearContestsCacheByContestId(int contestId)
        => await this.cache.Remove(string.Format(CacheConstants.ContestById, contestId));
}