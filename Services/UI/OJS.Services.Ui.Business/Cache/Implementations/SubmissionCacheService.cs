namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;

using System.Threading.Tasks;

public class SubmissionCacheService : ISubmissionCacheService
{
    private readonly ICacheService cache;
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly ISubmissionsDataService submissionsDataService;

    public SubmissionCacheService(
        ICacheService cache,
        ISubmissionsBusinessService submissionsBusiness,
        ISubmissionsDataService submissionsDataService)
    {
        this.cache = cache;
        this.submissionsBusiness = submissionsBusiness;
        this.submissionsDataService = submissionsDataService;
    }

    public Task<int> GetTotalCount(int? cacheSeconds)
        => cacheSeconds.HasValue
            ? this.cache.GetItem(
                CacheConstants.TotalSubmissionsCount,
                this.submissionsBusiness.GetTotalCount,
                cacheSeconds.Value)
            : this.cache.GetItem(
                CacheConstants.TotalSubmissionsCount,
                this.submissionsBusiness.GetTotalCount);
}