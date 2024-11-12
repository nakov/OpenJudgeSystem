namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Contests;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestParticipantsCacheService : IService
{
    /// <summary>
    /// Gets the participants count for contests in category page (for Compete and Practice mode).
    /// <para>
    /// Even a contest does not have any participants or a contest does not exist,
    /// it will be included in the result with 0 participants.
    /// </para>
    /// </summary>
    /// /// <param name="contestIds">The Ids of the contests.</param>
    /// /// <param name="page">The page for which to get the info and cache the results.</param>
    /// /// <param name="cacheSeconds">Seconds to cache.</param>
    Task<IDictionary<int, ContestParticipantsCountCacheModel>> GetParticipantsCount(
        IReadOnlyCollection<int> contestIds,
        int? page,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds);

    /// <summary>
    /// Gets the participants count for a contest (for Compete and Practice mode).
    /// <para>
    /// Even a contest does not have any participants or a contest does not exist,
    /// it will be included in the result with 0 participants.
    /// </para>
    /// </summary>
    /// <param name="contestId">The Id of the contest.</param>
    /// <param name="cacheSeconds">Seconds to cache.</param>
    Task<ContestParticipantsCountCacheModel> GetParticipantsCountForContest(
        int contestId,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds);
}