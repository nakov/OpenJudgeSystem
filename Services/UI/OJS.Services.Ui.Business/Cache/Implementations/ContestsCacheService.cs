namespace OJS.Services.Ui.Business.Cache.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Ui.Models.Contests;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Extensions;

public class ContestsCacheService : IContestsCacheService
{
    private readonly ICacheService cache;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsDataService problemsData;

    public ContestsCacheService(
        ICacheService cache,
        IContestsDataService contestsData,
        IProblemsDataService problemsData)
    {
        this.cache = cache;
        this.contestsData = contestsData;
        this.problemsData = problemsData;
    }

    public async Task<ContestDetailsServiceModel?> GetContestDetailsServiceModel(int contestId)
        => await this.cache.Get(
            string.Format(CacheConstants.ContestDetailsById, contestId),
            async () => await this.GetContestDetails(contestId),
            CacheConstants.FiveMinutesInSeconds);

    private async Task<ContestDetailsServiceModel?> GetContestDetails(int contestId)
    {
        var contest = await this.contestsData.OneByIdTo<ContestDetailsServiceModel>(contestId);

        if (contest is null)
        {
            return null;
        }

        contest.Problems = await this.problemsData.GetAllByContest(contestId)
            .MapCollection<ContestProblemServiceModel>()
            .OrderBy(p => p.OrderBy)
            .ThenBy(p => p.Name)
            .ToListAsync();

        contest.AllowedSubmissionTypes = contest.Problems
            .SelectMany(p => p.AllowedSubmissionTypes)
            .DistinctBy(st => st.Id)
            .MapCollection<ContestDetailsSubmissionTypeServiceModel>()
            .ToList();

        return contest;
    }
}