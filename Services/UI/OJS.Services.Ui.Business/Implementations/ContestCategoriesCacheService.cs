namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ContestCategoriesCacheService : IContestCategoriesCacheService
{
    private readonly ICacheService cache;
    private readonly IContestCategoriesBusinessService contestCategoriesBusiness;

    public ContestCategoriesCacheService(
        ICacheService cache,
        IContestCategoriesBusinessService contestCategoriesBusiness)
    {
        this.cache = cache;
        this.contestCategoriesBusiness = contestCategoriesBusiness;
    }

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetContestSubCategoriesList(
        int categoryId,
        int? cacheSeconds)
    {
        var cacheId = string.Format(CacheConstants.ContestSubCategoriesFormat, categoryId);

        return await this.cache.Get(
            cacheId,
            () => this.contestCategoriesBusiness.GetAllSubcategories(categoryId),
            cacheSeconds);
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds)
    {
        var cacheId = string.Format(CacheConstants.ContestParentCategoriesFormat, categoryId);

        return await this.cache.Get(
            cacheId,
            () => this.contestCategoriesBusiness.GetAllParentCategories(categoryId),
            cacheSeconds);
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetMainContestCategories(int? cacheSeconds)
        => await this.cache.Get(
            CacheConstants.MainContestCategoriesDropDown,
            this.contestCategoriesBusiness.GetAllMain,
            cacheSeconds);

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllContestCategoriesTree(int? cacheSeconds)
        => await this.cache.Get(
            CacheConstants.ContestCategoriesTree,
            this.contestCategoriesBusiness.GetTree,
            cacheSeconds);
}