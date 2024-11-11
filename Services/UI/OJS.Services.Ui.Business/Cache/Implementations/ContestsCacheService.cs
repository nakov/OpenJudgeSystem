namespace OJS.Services.Ui.Business.Cache.Implementations;

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
using System.Collections.Generic;

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
        var contest = await this.GetContest(contestId).Map<ContestDetailsServiceModel?>();

        if (contest is null)
        {
            return null;
        }

        contest.Problems = await this.GetContestProblems(contestId);

        contest.AllowedSubmissionTypes = contest.Problems
            .SelectMany(p => p.AllowedSubmissionTypes)
            .DistinctBy(st => st.Id)
            .MapCollection<ContestDetailsSubmissionTypeServiceModel>()
            .ToList();

        return contest;
    }

    public async Task<ContestServiceModel?> GetContestServiceModel(int contestId)
    {
        var contest = await this.GetContest(contestId).Map<ContestServiceModel?>();

        if (contest is null)
        {
            return null;
        }

        contest.Problems = await this.GetContestProblems(contestId);

        contest.AllowedSubmissionTypes = contest.Problems
            .SelectMany(p => p.AllowedSubmissionTypes)
            .DistinctBy(st => st.Id)
            .ToList();

        return contest;
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

    private async Task<List<ContestProblemServiceModel>> GetContestProblems(int contestId)
        => [.. (await this.problemsCache.GetByContestId(contestId))
            .MapCollection<ContestProblemServiceModel>()
            .OrderBy(p => p.OrderBy)
            .ThenBy(p => p.Name)];
}