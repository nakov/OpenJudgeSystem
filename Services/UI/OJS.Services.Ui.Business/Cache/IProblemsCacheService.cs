namespace OJS.Services.Ui.Business.Cache;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;

public interface IProblemsCacheService : IService
{
    Task<ICollection<Problem>> GetByContestId(
        int contestId,
        int cacheSeconds = CacheConstants.FiveMinutesInSeconds);
}