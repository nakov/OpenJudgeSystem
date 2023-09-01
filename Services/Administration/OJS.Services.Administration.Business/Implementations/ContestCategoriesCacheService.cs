namespace OJS.Services.Administration.Business.Implementations;

using Data;
using Infrastructure.Cache;
using Infrastructure.Constants;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;

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
            .ForEach(this.RemoveCacheFromCategory);

        while (contestCategory != null)
        {
            this.RemoveCacheFromCategory(contestCategory.Id);

            contestCategory = contestCategory.Parent;
        }
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