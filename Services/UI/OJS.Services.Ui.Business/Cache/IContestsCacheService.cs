namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Ui.Models.Contests;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Ui.Models.Cache;

public interface IContestsCacheService : IService
{
    Task<ContestDetailsServiceModel?> GetContestDetailsServiceModel(int contestId);

    Task<ContestServiceModel?> GetContestServiceModel(int contestId);

    Task<ContestCacheModel?> GetContest(int contestId);
}