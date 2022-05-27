namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Constants;

public interface ISubmissionTypesCacheService : IService
{
    Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllByUsage(
        int? cacheSeconds = CacheConstants.OneHourInSeconds);
}