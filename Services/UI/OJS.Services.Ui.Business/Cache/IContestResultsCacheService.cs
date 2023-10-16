namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface IContestResultsCacheService : IService
{
    Task<ContestResultsServiceModel> GetContestResults(
        int contestId,
        bool official,
        bool full,
        int? cacheSeconds = CacheConstants.TwoMinutesInSeconds);
}