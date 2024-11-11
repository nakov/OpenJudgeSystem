namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;

public class ProblemsCache : IProblemsCacheService
{
    private readonly IProblemsDataService problemsData;
    private readonly ICacheService cache;

    public ProblemsCache(
        IProblemsDataService problemsData,
        ICacheService cache)
    {
        this.problemsData = problemsData;
        this.cache = cache;
    }

    public async Task<ICollection<ProblemCacheModel>> GetByContestId(
        int contestId,
        int cacheSeconds)
        => await this.cache.Get(
            string.Format(CacheConstants.ProblemsByContestId, contestId),
            async () => await this.problemsData
                .GetAllByContest(contestId)
                .AsNoTracking()
                .MapCollection<ProblemCacheModel>()
                .ToListAsync(),
            cacheSeconds);
}