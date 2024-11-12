namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;

public interface ISubmissionTypesCacheService : IService
{
    Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage(
        int cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<SubmissionTypeCacheModel?> GetById(
        int submissionTypeId,
        int cacheSeconds = CacheConstants.OneDayInSeconds);
}