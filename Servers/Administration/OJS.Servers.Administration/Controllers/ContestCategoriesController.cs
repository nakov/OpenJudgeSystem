namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesController : AutoCrudAdminController<ContestCategory>
{
    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly ICacheService cache;
    private readonly ICacheItemsProviderService cacheItemsProvider;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesData,
        ICacheService cache,
        ICacheItemsProviderService cacheItemsProvider)
    {
        this.contestCategoriesData = contestCategoriesData;
        this.cache = cache;
        this.cacheItemsProvider = cacheItemsProvider;
    }

    protected override Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        IDictionary<string, string> entityDict)
        => this.cacheItemsProvider.ClearContestCategory(existingEntity.Id);

    protected override Task BeforeEntitySaveOnDeleteAsync(
        ContestCategory entity,
        IDictionary<string, string> entityDict)
        => Task.WhenAll(
            this.cacheItemsProvider.ClearContestCategory(entity.Id),
            this.CascadeDeleteCategories(entity));

    protected override Task AfterEntitySaveOnCreateAsync(
        ContestCategory entity,
        IDictionary<string, string> entityDict)
    {
        this.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
    }

    protected override Task AfterEntitySaveOnEditAsync(
        ContestCategory oldEntity,
        ContestCategory entity,
        IDictionary<string, string> entityDict)
    {
        this.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
    }

    protected override Task AfterEntitySaveOnDeleteAsync(
        ContestCategory entity,
        IDictionary<string, string> entityDict)
    {
        this.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
    }

    private void ClearMainContestCategoriesCache()
    {
        this.cache.Remove(CacheConstants.MainContestCategoriesDropDown);
        this.cache.Remove(CacheConstants.ContestCategoriesTree);
    }

    private async Task CascadeDeleteCategories(ContestCategory contestCategory)
    {
        foreach (var children in contestCategory.Children.ToList())
        {
            await this.CascadeDeleteCategories(children);
        }

        this.contestCategoriesData.Delete(contestCategory);
    }
}