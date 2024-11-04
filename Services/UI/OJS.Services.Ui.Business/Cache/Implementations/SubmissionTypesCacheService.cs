namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.SubmissionTypes;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using OJS.Services.Ui.Data;

public class SubmissionTypesCacheService : ISubmissionTypesCacheService
{
    private readonly ICacheService cache;
    private readonly ISubmissionTypesBusinessService submissionTypesBusiness;
    private readonly ISubmissionTypesDataService submissionTypesData;

    public SubmissionTypesCacheService(
        ICacheService cache,
        ISubmissionTypesBusinessService submissionTypesBusiness,
        ISubmissionTypesDataService submissionTypesData)
    {
        this.cache = cache;
        this.submissionTypesBusiness = submissionTypesBusiness;
        this.submissionTypesData = submissionTypesData;
    }

    public Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage(int? cacheSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                CacheConstants.SubmissionTypesByUsage,
                this.submissionTypesBusiness.GetAllOrderedByLatestUsage,
                cacheSeconds.Value)
            : this.cache.Get(
                CacheConstants.SubmissionTypesByUsage,
                this.submissionTypesBusiness.GetAllOrderedByLatestUsage);

    public async Task<SubmissionType?> GetById(
        int submissionTypeId,
        int cacheSeconds = CacheConstants.OneHourInSeconds)
        => await this.cache.Get(
            string.Format(CacheConstants.SubmissionTypeById, submissionTypeId),
            async () => await this.submissionTypesData.OneById(submissionTypeId),
            cacheSeconds);
}