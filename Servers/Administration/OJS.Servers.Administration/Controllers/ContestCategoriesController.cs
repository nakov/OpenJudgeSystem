namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesController : BaseAutoCrudAdminController<ContestCategory>
{
    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly IContestCategoriesCacheService contestCategoriesCache;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesData,
        IContestCategoriesCacheService contestCategoriesCache)
    {
        this.contestCategoriesData = contestCategoriesData;
        this.contestCategoriesCache = contestCategoriesCache;
    }

    protected override Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
        => this.contestCategoriesCache.ClearContestCategory(existingEntity.Id);

    protected override Task BeforeEntitySaveOnDeleteAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
        => Task.WhenAll(
            this.contestCategoriesCache.ClearContestCategory(entity.Id),
            this.CascadeDeleteCategories(entity));

    protected override Task AfterEntitySaveOnCreateAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
    }

    protected override Task AfterEntitySaveOnEditAsync(
        ContestCategory oldEntity,
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
    }

    protected override Task AfterEntitySaveOnDeleteAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        return Task.CompletedTask;
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