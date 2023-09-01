namespace OJS.Services.Ui.Business.Cache;

using SoftUni.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;

public interface IContestParticipantsCacheService : IService
{
    Task<int> GetCompeteContestParticipantsCount(int contestId, int cacheSeconds = CacheConstants.FiveMinutesInSeconds);

    Task<int> GetPracticeContestParticipantsCount(int contestId, int cacheSeconds = CacheConstants.FiveMinutesInSeconds);
}