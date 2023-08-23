namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Infrastructure.Constants;
using System.Linq;
using OJS.Services.Infrastructure.Cache;
using Data;

public class ContestParticipantsCacheService : IContestParticipantsCacheService
{
    private readonly ICacheService cache;
    private readonly IParticipantsDataService participantsDataService;

    public ContestParticipantsCacheService(ICacheService cache, IParticipantsDataService participantsDataService)
    {
        this.cache = cache;
        this.participantsDataService = participantsDataService;
    }

    public int GetParticipantsCountByContestAndIsOfficial(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                string.Format(CacheConstants.ContestParticipants, contestId),
                () => this.participantsDataService.GetAllOfficialByContest(contestId),
                cacheSeconds.Value).Count()
            : this.cache.Get(
                string.Format(CacheConstants.ContestParticipants, contestId),
                () => this.participantsDataService.GetAllOfficialByContest(contestId)).Count();

    public int GetParticipantsCountByContest(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                string.Format(CacheConstants.ContestParticipants, contestId),
                () => this.participantsDataService.GetAllByContest(contestId),
                cacheSeconds.Value).Count()
            : this.cache.Get(
                string.Format(CacheConstants.ContestParticipants, contestId),
                () => this.participantsDataService.GetAllByContest(contestId).Count());
}