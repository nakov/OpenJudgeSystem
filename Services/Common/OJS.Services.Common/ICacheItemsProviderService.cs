namespace OJS.Services.Common;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Constants;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICacheItemsProviderService : IService
{
    IEnumerable<ContestCategoryListViewModel> GetContestSubCategoriesList(
        int? categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    IEnumerable<CategoryMenuItemViewModel> GetMainContestCategories(
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task<string?> GetContestCategoryName(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds);

    Task ClearContestCategory(int categoryId);
}