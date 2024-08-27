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

    public Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage(int? cacheSeconds)
        => cacheSeconds.HasValue
            ? this.cache.GetItem(
                CacheConstants.SubmissionTypesByUsage,
                this.submissionTypesBusiness.GetAllOrderedByLatestUsage,
                cacheSeconds.Value)
            : this.cache.GetItem(
                CacheConstants.SubmissionTypesByUsage,
                this.submissionTypesBusiness.GetAllOrderedByLatestUsage);
}