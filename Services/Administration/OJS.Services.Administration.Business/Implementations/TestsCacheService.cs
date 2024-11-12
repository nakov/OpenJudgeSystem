namespace OJS.Services.Administration.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;

public class TestsCacheService : ITestsCacheService
{
    private readonly ICacheService cache;

    public TestsCacheService(ICacheService cache)
        => this.cache = cache;

    public Task ClearTestsCacheByProblemId(int problemId)
        => this.cache.Remove(string.Format(CacheConstants.TestsByProblemId, problemId));
}