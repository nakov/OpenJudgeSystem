using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Models.Cache;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business
{
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;


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

        Task<string> GetContestCategoryName(
            int categoryId,
            int? cacheSeconds = CacheConstants.OneDayInSeconds);

        Task ClearContestCategory(int categoryId);
    }
}