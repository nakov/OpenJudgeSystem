namespace OJS.Services.Administration.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Linq;

public class ProblemsCacheService : IProblemsCacheService
{
    private readonly IProblemsDataService problemsData;
    private readonly ICacheService cache;

    public ProblemsCacheService(
        IProblemsDataService problemsData,
        ICacheService cache)
    {
        this.problemsData = problemsData;
        this.cache = cache;
    }

    public async Task ClearProblemCacheById(int problemId)
    {
        var problem = await this.problemsData.GetByIdQuery(problemId)
            .Select(p => new { p.ProblemGroup.ContestId })
            .FirstOrDefaultAsync();

        var contestId = problem?.ContestId;

        await this.cache.Remove(string.Format(CacheConstants.ProblemForSubmit, problemId));
        await this.cache.Remove(string.Format(CacheConstants.ContestDetailsById, contestId));
    }
}