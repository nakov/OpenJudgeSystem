namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Threading.Tasks;
using OJS.Data.Models.Checkers;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;
using System.Collections.Generic;
using System.Linq;

public class CheckersCacheService : ICheckersCacheService
{
    private readonly ICacheService cacheService;
    private readonly IDataService<Checker> checkersData;

    public CheckersCacheService(
        ICacheService cacheService,
        IDataService<Checker> checkersData)
    {
        this.cacheService = cacheService;
        this.checkersData = checkersData;
    }

    public async Task<CheckerCacheModel?> GetById(
        int checkerId,
        int cacheSeconds)
        => await this.cacheService.Get(
            string.Format(CacheConstants.CheckerById, checkerId),
            async () => await this.checkersData.OneByIdTo<CheckerCacheModel>(checkerId),
            cacheSeconds);

    public async Task<IDictionary<int, CheckerCacheModel?>> GetAllByIds(int[] checkerIds, int cacheSeconds = CacheConstants.OneDayInSeconds)
    {
        checkerIds = checkerIds.Distinct().ToArray();
        var checkers = new Dictionary<int, CheckerCacheModel?>();
        foreach (var checkerId in checkerIds)
        {
            checkers[checkerId] = await this.cacheService.Get(
                string.Format(CacheConstants.CheckerById, checkerId),
                async () => await this.checkersData.OneByIdTo<CheckerCacheModel>(checkerId),
                cacheSeconds);
        }

        return checkers;
    }
}