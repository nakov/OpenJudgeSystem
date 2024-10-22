namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestCategoriesCacheService : IService
{
    Task<IEnumerable<ContestCategoryTreeViewModel>> GetContestSubCategoriesList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IEnumerable<ContestCategoryListViewModel>> GetMainContestCategories(
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllContestCategoriesTree(
        int? cacheSeconds = CacheConstants.OneHourInSeconds);

    Task<bool> IsCategoryChildOfInvisibleParentRecursive(
        int? categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);
}