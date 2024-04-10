namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestParticipantsCacheService : IContestParticipantsCacheService
{
    private readonly ICacheService cache;
    private readonly IParticipantsDataService participantsDataService;

    public ContestParticipantsCacheService(
        ICacheService cache,
        IParticipantsDataService participantsDataService)
    {
        this.cache = cache;
        this.participantsDataService = participantsDataService;
    }

    public async Task<IDictionary<int, ContestParticipantsCountCacheModel>> GetParticipantsCount(
        IReadOnlyCollection<int> contestIds,
        int? page,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds)
    {
        var contestIdsKey = CacheKeyGenerator.GenerateKeyForPrimitiveCollection(contestIds);
        var cacheKey = string.Format(CacheConstants.ParticipantsCountByContestsPage, contestIdsKey, page);
        return await this.cache.Get(
            cacheKey,
            async () => await this.GetContestsParticipantsCount(contestIds),
            cacheSeconds);
    }

    public async Task<ContestParticipantsCountCacheModel> GetParticipantsCountForContest(
        int contestId,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds)
        => await this.cache.Get(
            string.Format(CacheConstants.ParticipantsCountByContest, contestId),
            async () => (await this.GetContestsParticipantsCount(new[] { contestId }))[contestId],
            cacheSeconds);

    /// <summary>
    /// Gets a dictionary with all provided contests (Id as Key) and their corresponding
    /// participants count, separated by Compete and Practice mode.
    /// <para>
    /// Even if a contest has no participants or the contest with the provided id does not exist,
    /// it will be included in the result with 0 participants.
    /// </para>
    /// </summary>
    /// <param name="contestIds">The contests for which to gather participants count.</param>
    /// <returns>Dictionary with all the provided <see cref="contestIds"/> as keys.</returns>
    private async Task<IDictionary<int, ContestParticipantsCountCacheModel>> GetContestsParticipantsCount(
        IReadOnlyCollection<int> contestIds)
    {
        var officialParticipants = await this.participantsDataService.GetParticipantsCountInContests(contestIds, true);
        var practiceParticipants = await this.participantsDataService.GetParticipantsCountInContests(contestIds, false);

        return contestIds.ToDictionary(
            id => id,
            id => new ContestParticipantsCountCacheModel
            {
                Official = officialParticipants.GetValueOrDefault(id),
                Practice = practiceParticipants.GetValueOrDefault(id),
            });
    }
}