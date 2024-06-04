namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;

public class ContestParticipantsCacheService : IContestParticipantsCacheService
{
    private readonly ICacheService cache;

    public ContestParticipantsCacheService(ICacheService cache)
        => this.cache = cache;

    public void ClearContestCacheByContestId(int contestId)
        => this.cache.Remove(string.Format(CacheConstants.ContestServiceModelByContestId, contestId));
}
