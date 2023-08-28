namespace OJS.Services.Ui.Business.Cache;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Constants;

public interface ISubmissionCacheService : IService
{
    public Task<int> GetTotalCount(int? cacheSeconds = CacheConstants.TwoMinutesInSeconds);
}