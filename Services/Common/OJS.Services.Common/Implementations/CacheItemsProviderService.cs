namespace OJS.Services.Common.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Cache;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;

public class CacheItemsProviderService : ICacheItemsProviderService
{
    private readonly ICacheService cache;
    private readonly IContestCategoriesDataService contestCategoriesData;

    public CacheItemsProviderService(
        ICacheService cache,
        IContestCategoriesDataService contestCategoriesData)
    {
        this.cache = cache;
        this.contestCategoriesData = contestCategoriesData;
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetContestSubCategoriesList(
        int? categoryId,
        int? cacheSeconds)
    {
        var cacheId = categoryId.HasValue
            ? string.Format(CacheConstants.ContestSubCategoriesFormat, categoryId.Value)
            : CacheConstants.ContestCategoriesTree;

        return await this.cache.Get(cacheId, GetSubCategories, cacheSeconds);

        async Task<IEnumerable<ContestCategoryListViewModel>> GetSubCategories()
            => await this.contestCategoriesData
                .GetAllVisible()
                .Where(cc => categoryId.HasValue ? cc.ParentId == categoryId : cc.ParentId == null)
                .OrderBy(cc => cc.OrderBy)
                .MapCollection<ContestCategoryListViewModel>()
                .ToListAsync();
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
        int categoryId,
        int? cacheSeconds = CacheConstants.OneDayInSeconds)
    {
        var cacheId = string.Format(CacheConstants.ContestParentCategoriesFormat, categoryId);

        return await this.cache.Get(cacheId, GetParentCategories, cacheSeconds);

        async Task<IEnumerable<ContestCategoryListViewModel>> GetParentCategories()
        {
            var categories = new List<ContestCategoryListViewModel>();
            var category = await this.contestCategoriesData.OneById(categoryId);

            while (category != null)
            {
                categories.Add(category.Map<ContestCategoryListViewModel>());

                category = category.Parent;
            }

            categories.Reverse();

            return categories;
        }
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetMainContestCategories(int? cacheSeconds)
    {
        return await this.cache.Get(CacheConstants.MainContestCategoriesDropDown, GetMainCategories, cacheSeconds);

        async Task<IEnumerable<ContestCategoryListViewModel>> GetMainCategories()
            => await this.contestCategoriesData
                .GetAllVisible()
                .Where(x => !x.ParentId.HasValue)
                .OrderBy(x => x.OrderBy)
                .MapCollection<ContestCategoryListViewModel>()
                .ToListAsync();
    }

    public Task<string?> GetContestCategoryName(int categoryId, int? cacheSeconds)
        => this.cache.Get(
            string.Format(CacheConstants.ContestCategoryNameFormat, categoryId),
            async () => await this.contestCategoriesData.GetNameById(categoryId),
            cacheSeconds);

    public async Task ClearContestCategory(int categoryId)
    {
        var contestCategory = await this.contestCategoriesData.OneById(categoryId);

        if (contestCategory == null)
        {
            return;
        }

        contestCategory.Children
            .Select(cc => cc.Id)
            .ToList()
            .ForEach(RemoveCacheFromCategory);

        while (contestCategory != null)
        {
            RemoveCacheFromCategory(contestCategory.Id);

            contestCategory = contestCategory.Parent;
        }

        void RemoveCacheFromCategory(int contestCategoryId)
        {
            var categoryNameCacheId = string.Format(
                CacheConstants.ContestCategoryNameFormat,
                contestCategoryId);

            var subCategoriesCacheId = string.Format(
                CacheConstants.ContestSubCategoriesFormat,
                contestCategoryId);

            var parentCategoriesCacheId = string.Format(
                CacheConstants.ContestParentCategoriesFormat,
                contestCategoryId);

            this.cache.Remove(categoryNameCacheId);
            this.cache.Remove(subCategoriesCacheId);
            this.cache.Remove(parentCategoriesCacheId);
        }
    }
}