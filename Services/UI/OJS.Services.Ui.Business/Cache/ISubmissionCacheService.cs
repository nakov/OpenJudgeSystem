namespace OJS.Services.Ui.Business.Cache;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionCacheService : IService
{
    public Task<int> GetTotalCount();
}