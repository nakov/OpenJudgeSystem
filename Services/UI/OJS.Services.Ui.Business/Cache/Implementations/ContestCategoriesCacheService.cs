namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System;
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

    public Task<IEnumerable<ContestCategoryTreeViewModel>> GetContestSubCategoriesList(
        int categoryId,
        int? cacheSeconds)
        => this.GetFromCache(
            string.Format(null, CacheConstants.ContestSubCategoriesFormat, categoryId),
            () => this.contestCategoriesBusiness.GetAllSubcategories(categoryId),
            cacheSeconds);

    public Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds)
        => this.GetFromCache(
            string.Format(null, CacheConstants.ContestParentCategoriesFormat, categoryId),
            () => this.contestCategoriesBusiness.GetAllParentCategories(categoryId),
            cacheSeconds);

    public Task<IEnumerable<ContestCategoryListViewModel>> GetMainContestCategories(int? cacheSeconds)
        => this.GetFromCache(
            CacheConstants.MainContestCategoriesDropDown,
            this.contestCategoriesBusiness.GetAllMain,
            cacheSeconds);

    public Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllContestCategoriesTree(int? cacheSeconds)
        => this.GetFromCache(
            CacheConstants.ContestCategoriesTree,
            this.contestCategoriesBusiness.GetTree,
            cacheSeconds);

    private Task<T> GetFromCache<T>(string cacheId, Func<Task<T>> getValueFunc, int? cacheSeconds)
        => cacheSeconds.HasValue
            ? this.cache.GetItem(
                cacheId,
                getValueFunc,
                cacheSeconds.Value)
            : this.cache.GetItem(
                cacheId,
                getValueFunc);
}