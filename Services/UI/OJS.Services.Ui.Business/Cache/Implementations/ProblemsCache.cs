namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Submissions;

public class ProblemsCache : IProblemsCacheService
{
    private readonly IProblemsDataService problemsData;
    private readonly ICacheService cache;
    private readonly ITestsDataService testsData;

    public ProblemsCache(
        IProblemsDataService problemsData,
        ICacheService cache,
        ITestsDataService testsData)
    {
        this.problemsData = problemsData;
        this.cache = cache;
        this.testsData = testsData;
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

    public Task<ProblemForSubmitCacheModel?> GetForSubmitById(int problemId)
        => this.cache.Get(
            string.Format(CacheConstants.ProblemForSubmit, problemId),
            async () => await this.GetProblemForSubmitById(problemId),
            CacheConstants.OneHourInSeconds,
            slidingExpirationSeconds: CacheConstants.FiveMinutesInSeconds);

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

        problem.Tests = await this.testsData
            .GetAllByProblem(problemId)
            .MapCollection<TestCacheModel>()
            .ToListAsync();

        return problem;
    }
}