namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Contests;

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

    public async Task<ICollection<Problem>> GetByContestId(
        int contestId,
        int cacheSeconds)
        => await this.cache.Get(
            string.Format(CacheConstants.ProblemsByContestId),
            async () => await this.GetWithResourcesAndSubmissionTypesInProblemsByContestId(contestId),
            cacheSeconds);

    private async Task<ICollection<Problem>> GetWithResourcesAndSubmissionTypesInProblemsByContestId(int contestId)
        => await this.problemsData
            .GetAllByContest(contestId)
            .AsNoTracking()
            .Include(p => p.Resources)
            .Include(p => p.SubmissionTypesInProblems)
            .ToListAsync();
}