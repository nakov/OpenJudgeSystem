namespace OJS.Services.Ui.Business.Cache;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;
using OJS.Services.Ui.Models.Cache;

public interface IProblemsCacheService : IService
{
    Task<ProblemForSubmitCacheModel?> GetForSubmitById(int problemId);
}