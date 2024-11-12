namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Extensions;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Submissions;
using System.Linq;

public class ProblemsCache : IProblemsCacheService
{
    private readonly IProblemsDataService problemsData;
    private readonly IContestsDataService contestsData;
    private readonly ICacheService cache;
    private readonly ICheckersCacheService checkersCache;
    private readonly ITestsCacheService testsCache;

    public ProblemsCache(
        IProblemsDataService problemsData,
        IContestsDataService contestsData,
        ICacheService cache,
        ICheckersCacheService checkersCache,
        ITestsCacheService testsCache)
    {
        this.problemsData = problemsData;
        this.contestsData = contestsData;
        this.cache = cache;
        this.checkersCache = checkersCache;
        this.testsCache = testsCache;
    }

    public async Task<ICollection<ProblemCacheModel>> GetByContestId(
        int contestId,
        int cacheSeconds)
    {
        var problems = await this.cache.Get(
            string.Format(CacheConstants.ProblemsByContestId, contestId),
            async () => await this.problemsData
                .GetAllByContest(contestId)
                .AsNoTracking()
                .MapCollection<ProblemCacheModel>()
                .ToListAsync(),
            cacheSeconds);

        var checkerIds = problems
            .Where(p => p.CheckerId is not null)
            .Select(p => p.CheckerId!.Value)
            .Distinct()
            .ToArray();

        var checkers = await this.checkersCache.GetAllByIds(checkerIds);

        foreach (var problem in problems)
        {
            if (problem.CheckerId == null)
            {
                continue;
            }

            problem.Checker = checkers.GetValueOrDefault(problem.CheckerId.Value);
        }

        return problems;
    }

    public Task<ProblemForSubmitCacheModel?> GetForSubmitById(int problemId)
        => this.cache.Get(
            string.Format(CacheConstants.ProblemForSubmit, problemId),
            async () => await this.GetProblemForSubmitById(problemId),
            CacheConstants.TenMinutesInSeconds,
            slidingExpirationSeconds: CacheConstants.OneMinuteInSeconds);

    private async Task<ProblemForSubmitCacheModel?> GetProblemForSubmitById(int problemId)
    {
        var problem = await this.problemsData
            .GetByIdQuery(problemId)
            .MapCollection<ProblemForSubmitCacheModel>()
            .FirstOrDefaultAsync();

        if (problem == null)
        {
            return null;
        }

        problem.Contest = await this.contestsData.OneByIdTo<ContestCacheModel>(problem.ProblemGroup.ContestId);
        problem.Tests = (await this.testsCache.GetByProblemId(problemId)).Values;
        problem.Checker = await this.checkersCache.GetById(problem.CheckerId ?? 0);

        return problem;
    }
}