namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Constants;

public interface ISubmissionTypesCacheService : IService
{
    Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage(
        int cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IEnumerable<AllowedContestStrategiesServiceModel>> GetAllForContestCategory(
        int contestCategoryId,
        int cacheSeconds = CacheConstants.OneDayInSeconds);
}