namespace OJS.Services.Administration.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesCacheService : IContestCategoriesCacheService
{
    private readonly ICacheService cache;
    private readonly IContestCategoriesDataService contestCategoriesData;

    public ContestCategoriesCacheService(
        ICacheService cache,
        IContestCategoriesDataService contestCategoriesData)
    {
        this.cache = cache;
        this.contestCategoriesData = contestCategoriesData;
    }

    public void ClearMainContestCategoriesCache()
    {
        this.cache.Remove(CacheConstants.MainContestCategoriesDropDown);
        this.cache.Remove(CacheConstants.ContestCategoriesTree);
    }

    public async Task ClearContestCategoryParentsAndChildren(int categoryId)
    {
        var contestCategory = await this.contestCategoriesData.GetByIdQuery(categoryId)
            .Include(cc => cc.Children)
            .FirstOrDefaultAsync();

        if (contestCategory == null)
        {
            return;
        }

        // Collect all child category IDs
        var allCategoryIds = new HashSet<int>(contestCategory.Children.Select(cc => cc.Id));
        var currentCategory = contestCategory;

        // Traverse upwards and collect parent IDs
        while (currentCategory != null && currentCategory.ParentId.HasValue)
        {
            allCategoryIds.Add(currentCategory.ParentId.Value);
            currentCategory = await this.contestCategoriesData
                .GetByIdQuery(currentCategory.ParentId.Value)
                .FirstOrDefaultAsync();
        }

        // Add the initial categoryId
        allCategoryIds.Add(categoryId);

        // Remove cache for all collected category IDs
        allCategoryIds.ToList().ForEach(this.RemoveCacheFromCategory);
    }

    private void RemoveCacheFromCategory(int contestCategoryId)
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