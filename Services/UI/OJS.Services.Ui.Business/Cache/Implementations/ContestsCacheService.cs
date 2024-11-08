namespace OJS.Services.Ui.Business.Cache.Implementations;

using System.Collections.Generic;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Ui.Models.Contests;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Cache;

public class ContestsCacheService : IContestsCacheService
{
    private readonly ICacheService cache;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsCacheService problemsCache;

    public ContestsCacheService(
        ICacheService cache,
        IContestsDataService contestsData,
        IProblemsCacheService problemsCache)
    {
        this.cache = cache;
        this.contestsData = contestsData;
        this.problemsCache = problemsCache;
    }

    public async Task<ContestDetailsServiceModel?> GetContestDetailsServiceModel(int contestId)
    {
        var (contest, problems) = await this.GetContestWithProblems(contestId);

        if (contest is null)
        {
            return null;
        }

        var contestDetailsServiceModel = contest.Map<ContestDetailsServiceModel>();

        contestDetailsServiceModel.Problems = problems.MapCollection<ContestProblemServiceModel>().ToList();

        contestDetailsServiceModel.AllowedSubmissionTypes = contestDetailsServiceModel.Problems
            .SelectMany(p => p.AllowedSubmissionTypes)
            .DistinctBy(st => st.Id)
            .MapCollection<ContestDetailsSubmissionTypeServiceModel>()
            .ToList();

        return contestDetailsServiceModel;
    }

    public async Task<ContestServiceModel?> GetContestServiceModel(int contestId)
    {
        var (contest, problems) = await this.GetContestWithProblems(contestId);

        if (contest is null)
        {
            return null;
        }

        var contestServiceModel = contest.Map<ContestServiceModel>();

        contestServiceModel.Problems = problems.MapCollection<ContestProblemServiceModel>().ToList();

        contestServiceModel.AllowedSubmissionTypes = contestServiceModel.Problems
            .SelectMany(p => p.AllowedSubmissionTypes)
            .DistinctBy(st => st.Id)
            .ToList();

        return contestServiceModel;
    }

    public async Task<(ContestCacheModel? Contest, ICollection<ProblemCacheModel> Problems)> GetContestWithProblems(int contestId)
    {
        var contest = await this.GetContest(contestId);

        if (contest is null)
        {
            return (null, []);
        }

        var problems = await this.GetProblemsForContest(contestId);

        return (contest, problems);
    }

    public async Task<ContestCacheModel?> GetContest(int contestId)
        => await this.cache.Get(
            string.Format(CacheConstants.Contest, contestId),
            async () => await this.contestsData
                .GetByIdQuery(contestId)
                .AsNoTracking()
                .MapCollection<ContestCacheModel>()
                .FirstOrDefaultAsync(),
            CacheConstants.FiveMinutesInSeconds);

    private async Task<ICollection<ProblemCacheModel>> GetProblemsForContest(int contestId)
        => await this.problemsCache.GetByContestId(contestId);
}