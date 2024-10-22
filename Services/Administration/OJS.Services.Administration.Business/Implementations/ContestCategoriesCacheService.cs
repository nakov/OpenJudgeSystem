namespace OJS.Services.Administration.Business.Implementations;

using System;
using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;

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

    public async Task ClearMainContestCategoriesCache()
    {
        await this.cache.Remove(CacheConstants.MainContestCategoriesDropDown);
        await this.cache.Remove(CacheConstants.ContestCategoriesTree);
    }

    public async Task ClearContestCategoryParentsAndChildren(int categoryId)
    {
        var contestCategory = await this.contestCategoriesData
            .GetByIdQuery(categoryId)
            .FirstOrDefaultAsync();

        if (contestCategory == null)
        {
            return;
        }

        var allCategoryIds = new HashSet<int>();
        var currentCategory = contestCategory;

        // Retrieve the IDs of all children
        await this.BreadthFirstSearch(
            contestCategory,
            childCategory => allCategoryIds.Add(childCategory.Id));

        // Traverse upwards and retrieve the IDs of all parents
        while (currentCategory is { ParentId: not null })
        {
            allCategoryIds.Add(currentCategory.ParentId.Value);
            currentCategory = await this.contestCategoriesData
                .GetByIdQuery(currentCategory.ParentId.Value)
                .FirstOrDefaultAsync();
        }

        // Remove cache for all collected category IDs
        await allCategoryIds.ToList().ForEachAsync(this.RemoveCacheFromCategory);
    }

    public async Task ClearIsCategoryChildOfInvisibleParent(int categoryId)
    {
        var contestCategory = await this.contestCategoriesData.GetByIdQuery(categoryId)
            .FirstOrDefaultAsync();

        if (contestCategory == null)
        {
            return;
        }

        await this.BreadthFirstSearch(
            contestCategory,
            childCategory => this.cache.Remove(string.Format(CultureInfo.InvariantCulture, CacheConstants.IsCategoryChildOfInvisibleParentFormat, childCategory.Id)));
    }

    private async Task BreadthFirstSearch(ContestCategory parent, Action<ContestCategory> action)
    {
        var queue = new Queue<ContestCategory>();
        queue.Enqueue(parent);

        while (queue.Count > 0)
        {
            var contestCategory = queue.Dequeue();

            await this.contestCategoriesData.LoadChildrenRecursively(contestCategory);

            action(contestCategory);

            foreach (var child in contestCategory.Children)
            {
                queue.Enqueue(child);
            }
        }
    }

    private async Task RemoveCacheFromCategory(int contestCategoryId)
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

        var isCategoryChildOfInvisibleParentCacheId = string.Format(
            CultureInfo.InvariantCulture,
            CacheConstants.IsCategoryChildOfInvisibleParentFormat,
            contestCategoryId);

        await this.cache.Remove(categoryNameCacheId);
        await this.cache.Remove(subCategoriesCacheId);
        await this.cache.Remove(parentCategoriesCacheId);
        await this.cache.Remove(isCategoryChildOfInvisibleParentCacheId);
    }
}