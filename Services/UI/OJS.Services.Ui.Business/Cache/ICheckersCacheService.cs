namespace OJS.Services.Ui.Business.Cache;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;
using System.Collections.Generic;

public interface ICheckersCacheService : IService
{
    Task<CheckerCacheModel?> GetById(
        int checkerId,
        int cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IDictionary<int, CheckerCacheModel?>> GetAllByIds(
        int[] checkerIds,
        int cacheSeconds = CacheConstants.OneDayInSeconds);
}