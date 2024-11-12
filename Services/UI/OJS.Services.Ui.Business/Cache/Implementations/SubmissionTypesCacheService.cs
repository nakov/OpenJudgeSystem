namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.SubmissionTypes;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;

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

    public Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage(int cacheSeconds)
        => this.cache.Get(
            CacheConstants.SubmissionTypesByUsage,
            this.submissionTypesBusiness.GetAllOrderedByLatestUsage,
            cacheSeconds);

    public async Task<SubmissionTypeCacheModel?> GetById(
        int submissionTypeId,
        int cacheSeconds)
        => await this.cache.Get(
            string.Format(CacheConstants.SubmissionTypeById, submissionTypeId),
            async () => await this.submissionTypesData.OneByIdTo<SubmissionTypeCacheModel>(submissionTypeId),
            cacheSeconds);
}