namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;

public class TestsCacheService : ITestsCacheService
{
    private readonly ITestsDataService testsData;
    private readonly ICacheService cache;

    public TestsCacheService(
        ITestsDataService testsData,
        ICacheService cache)
    {
        this.testsData = testsData;
        this.cache = cache;
    }

    public async Task<IDictionary<int, TestCacheModel>> GetByProblemId(int problemId)
        => await this.cache.Get(
            string.Format(CacheConstants.TestsByProblemId, problemId),
            async () => await this.testsData
                .GetAllByProblem(problemId)
                .MapCollection<TestCacheModel>()
                .ToDictionaryAsync(t => t.Id, t => t),
            cacheSeconds: CacheConstants.OneDayInSeconds,
            slidingExpirationSeconds: CacheConstants.FiveMinutesInSeconds);
}