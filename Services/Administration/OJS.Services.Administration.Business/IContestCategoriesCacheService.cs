namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestCategoriesCacheService : IService
{
    void ClearMainContestCategoriesCache();

    Task ClearContestCategory(int categoryId);
}