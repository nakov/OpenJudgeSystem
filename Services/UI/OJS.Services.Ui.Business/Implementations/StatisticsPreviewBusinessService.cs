namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Statistics;
using System.Threading.Tasks;

public class StatisticsPreviewBusinessService
    : IStatisticsPreviewBusinessService
{
    private const int CacheDuration = 24 * 60 * 60;
    private const string HomeCacheKey = nameof(HomeStatisticsServiceModel);

    private readonly IContestsDataService contestsData;
    private readonly IUsersProfileDataService usersProfileData;
    private readonly IProblemsDataService problemsData;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly ICacheService cache;

    public StatisticsPreviewBusinessService(
        IContestsDataService contestsData,
        IUsersProfileDataService usersProfileData,
        IProblemsDataService problemsData,
        ISubmissionsDataService submissionsData,
        ISubmissionTypesDataService submissionTypesData,
        ICacheService cache)
    {
        this.contestsData = contestsData;
        this.usersProfileData = usersProfileData;
        this.problemsData = problemsData;
        this.submissionsData = submissionsData;
        this.submissionTypesData = submissionTypesData;
        this.cache = cache;
    }

    public Task<HomeStatisticsServiceModel> GetForHome()
        => this.cache.Get(
            HomeCacheKey,
            this.GetForCacheFunc,
            CacheDuration
        );

    private async Task<HomeStatisticsServiceModel> GetForCacheFunc()
        => new()
        {
            ContestsCount = await this.contestsData.GetCount(),
            UsersCount = await this.usersProfileData.GetCount(),
            ProblemsCount = await this.problemsData.GetCount(),
            SubmissionsCount = await this.submissionsData.GetCount(),
            StrategiesCount = await this.submissionTypesData.GetCount(),
            SubmissionsPerMinuteCount = 18,
        };
}