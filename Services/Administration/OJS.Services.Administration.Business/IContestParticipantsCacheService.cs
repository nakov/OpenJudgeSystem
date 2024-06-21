namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;

public interface IContestParticipantsCacheService : IService
{
    void ClearContestCacheByContestId(int contestId);
}
