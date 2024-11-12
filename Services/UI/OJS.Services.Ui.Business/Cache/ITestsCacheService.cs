namespace OJS.Services.Ui.Business.Cache;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure;
using OJS.Services.Ui.Models.Cache;

public interface ITestsCacheService : IService
{
    Task<IDictionary<int, TestCacheModel>> GetByProblemId(int problemId);
}