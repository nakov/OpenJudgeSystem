namespace OJS.Services.Ui.Business.Cache;

using System.Threading.Tasks;
using OJS.Data.Models.Checkers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Constants;

public interface ICheckersCacheService : IService
{
    Task<Checker?> GetById(
        int checkerId,
        int cacheSeconds = CacheConstants.OneHourInSeconds);
}