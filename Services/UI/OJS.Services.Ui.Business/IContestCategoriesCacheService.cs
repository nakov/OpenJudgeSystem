namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Constants;
using SoftUni.Services.Infrastructure;
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
}