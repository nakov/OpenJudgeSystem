namespace OJS.Services.Administration.Business.Implementations;

using System.Threading.Tasks;
using OJS.Data.Models.Checkers;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;

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

    public async Task<Checker?> GetById(
        int checkerId,
        int cacheSeconds = CacheConstants.OneHourInSeconds)
        => await this.cacheService.Get(
            string.Format(CacheConstants.CheckersById, checkerId),
            async () => await this.checkersData.OneById(checkerId),
            cacheSeconds);
}