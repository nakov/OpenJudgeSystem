namespace OJS.Services.Ui.Business.Cache;

using SoftUni.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Common.Models.Cache;
using System.Threading.Tasks;

public interface IContestParticipantsCacheService : IService
{
    Task<ContestParticipantsViewModel> GetCompeteContestParticipantsCount(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds);

    Task<ContestParticipantsViewModel> GetPracticeContestParticipantsCount(int contestId, int? cacheSeconds = CacheConstants.FiveMinutesInSeconds);
}