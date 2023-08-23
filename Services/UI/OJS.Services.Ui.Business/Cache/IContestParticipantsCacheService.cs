namespace OJS.Services.Ui.Business.Cache;

using SoftUni.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;

public interface IContestParticipantsCacheService : IService
{
    int GetParticipantsCountByContestAndIsOfficial(int contestId, bool official, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds);

    int GetParticipantsCountByContest(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds);
}