namespace OJS.Services.Ui.Business.Cache.Implementations;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Ui.Data;

public class ContestCategoriesCacheService : IContestCategoriesCacheService
{
    private readonly ICacheService cache;
    private readonly IContestCategoriesBusinessService contestCategoriesBusiness;
    private readonly IContestCategoriesDataService contestCategoriesData;

    public ContestCategoriesCacheService(
        ICacheService cache,
        IContestCategoriesBusinessService contestCategoriesBusiness,
        IContestCategoriesDataService contestCategoriesData)
    {
        this.cache = cache;
        this.contestCategoriesBusiness = contestCategoriesBusiness;
        this.contestCategoriesData = contestCategoriesData;
    }

    public Task<IEnumerable<ContestCategoryTreeViewModel>> GetContestSubCategoriesList(
        int categoryId,
        int? cacheSeconds)
        => this.GetFromCache(
            string.Format(CultureInfo.InvariantCulture, CacheConstants.ContestSubCategoriesFormat, categoryId),
            () => this.contestCategoriesBusiness.GetAllSubcategories(categoryId),
            cacheSeconds);

    public Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds)
        => this.GetFromCache(
            string.Format(CacheConstants.ContestParentCategoriesFormat, categoryId),
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

    public async Task<bool> IsCategoryChildOfInvisibleParentRecursive(int? categoryId, int? cacheSeconds = null)
        => await this.GetFromCache(
            string.Format(CultureInfo.InvariantCulture, CacheConstants.IsCategoryChildOfInvisibleParentFormat, categoryId),
            () => this.ComputeIsCategoryChildOfInvisibleParentRecursive(categoryId),
            cacheSeconds);

    private async Task<bool> ComputeIsCategoryChildOfInvisibleParentRecursive(int? categoryId)
    {
        if (categoryId == null)
        {
            return false;
        }

        var categoryWithParent = this.contestCategoriesData
            .GetByIdQuery(categoryId)
            .Include(c => c.Parent)
            .FirstOrDefault();

        if (categoryWithParent?.Parent != null)
        {
            if (!categoryWithParent.Parent.IsVisible)
            {
                return true;
            }

            return await this.IsCategoryChildOfInvisibleParentRecursive(categoryWithParent.Parent.Id);
        }

        return false;
    }

    private Task<T> GetFromCache<T>(string cacheId, Func<Task<T>> getValueFunc, int? cacheSeconds)
        => cacheSeconds.HasValue
            ? this.cache.Get(
                cacheId,
                getValueFunc,
                cacheSeconds.Value)
            : this.cache.Get(
                cacheId,
                getValueFunc);
}