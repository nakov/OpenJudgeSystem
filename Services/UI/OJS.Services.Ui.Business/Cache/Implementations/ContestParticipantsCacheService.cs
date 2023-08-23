namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Common.Models.Cache;
using System.Threading.Tasks;

public class ContestParticipantsCacheService : IContestParticipantsCacheService
{
    private readonly ICacheService cache;
    private readonly IParticipantsBusinessService participantsBusinessService;

    public ContestParticipantsCacheService(ICacheService cache, IParticipantsBusinessService participantsBusinessService)
    {
        this.cache = cache;
        this.participantsBusinessService = participantsBusinessService;
    }

    public Task<ContestParticipantsViewModel> GetCompeteContestParticipantsCount(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                string.Format(CacheConstants.CompeteContestParticipantsCount, contestId),
                () => this.participantsBusinessService.GetParticipantsCountByContest(contestId),
                cacheSeconds.Value)
            : this.cache.Get(
                string.Format(CacheConstants.CompeteContestParticipantsCount, contestId),
                () => this.participantsBusinessService.GetParticipantsCountByContest(contestId));

    public Task<ContestParticipantsViewModel> GetPracticeContestParticipantsCount(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                string.Format(CacheConstants.PracticeContestParticipantsCount, contestId),
                () => this.participantsBusinessService.GetParticipantsCountByContest(contestId),
                cacheSeconds.Value)
            : this.cache.Get(
                string.Format(CacheConstants.PracticeContestParticipantsCount, contestId),
                () => this.participantsBusinessService.GetParticipantsCountByContest(contestId));
}