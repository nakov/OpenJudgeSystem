namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestCategoriesCacheService : IService
{
    Task ClearMainContestCategoriesCache();

    Task ClearContestCategory(int categoryId);
}