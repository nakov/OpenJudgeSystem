namespace OJS.Services.Ui.Business.Cache;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Submissions;

public interface IProblemsCacheService : IService
{
    Task<ICollection<ProblemCacheModel>> GetByContestId(
        int contestId,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds);

    Task<ProblemForSubmitCacheModel?> GetForSubmitById(int problemId);
}