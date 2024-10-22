namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestCategoriesCacheService : IService
{
    Task ClearMainContestCategoriesCache();

    Task ClearContestCategoryParentsAndChildren(int categoryId);

    Task ClearIsCategoryChildOfInvisibleParent(int categoryId);
}