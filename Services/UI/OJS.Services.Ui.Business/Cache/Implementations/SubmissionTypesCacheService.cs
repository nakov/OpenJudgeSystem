namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.SubmissionTypes;
using System.Collections.Generic;
using System.Threading.Tasks;

public class SubmissionTypesCacheService : ISubmissionTypesCacheService
{
    private readonly ICacheService cache;
    private readonly ISubmissionTypesBusinessService submissionTypesBusiness;

    public SubmissionTypesCacheService(
        ICacheService cache,
        ISubmissionTypesBusinessService submissionTypesBusiness)
    {
        this.cache = cache;
        this.submissionTypesBusiness = submissionTypesBusiness;
    }

    public Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllForContestCategory(
        int contestCategoryId,
        int cacheSeconds = CacheConstants.OneDayInSeconds)
        => this.cache.Get(
            string.Format(CacheConstants.SubmissionTypesByContestCategory, contestCategoryId),
            async () => await this.submissionTypesBusiness.GetAllForContestCategory(contestCategoryId),
            cacheSeconds);
}