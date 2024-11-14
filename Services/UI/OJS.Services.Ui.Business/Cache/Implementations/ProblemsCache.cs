namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;

public class ProblemsCache : IProblemsCacheService
{
    private readonly ICacheService cache;
    private readonly IProblemsDataService problemsData;
    private readonly ITestsDataService testsData;

    public ProblemsCache(
        ICacheService cache,
        IProblemsDataService problemsData,
        ITestsDataService testsData)
    {
        this.cache = cache;
        this.problemsData = problemsData;
        this.testsData = testsData;
    }

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
            .AsNoTracking()
            .MapCollection<ProblemForSubmitCacheModel>()
            .FirstOrDefaultAsync();

        if (problem == null)
        {
            return null;
        }

        problem.Tests = await this.testsData
            .GetAllByProblem(problemId)
            .AsNoTracking()
            .MapCollection<TestCacheModel>()
            .ToListAsync();

        return problem;
    }
}