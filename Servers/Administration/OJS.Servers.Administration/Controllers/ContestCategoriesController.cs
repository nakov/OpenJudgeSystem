namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

using GlobalResource = OJS.Common.Resources.ContestCategoriesController;

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

    protected override Task BeforeEntitySaveOnCreateAsync(ContestCategory entity, AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(entity.Name))
        {
            throw new Exception(GlobalResource.RequiredName);
        }

        if (entity.ParentId == 0)
        {
            entity.ParentId = null;
        }

        return base.BeforeEntitySaveOnCreateAsync(entity, actionContext);
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(newEntity.Name))
        {
            throw new Exception(GlobalResource.RequiredName);
        }

        if (newEntity.ParentId == 0)
        {
            newEntity.ParentId = null;
            newEntity.Parent = null;
        }
        else
        {
            newEntity.Parent = await this.contestCategoriesData.GetById(newEntity.ParentId);
        }

        await this.contestCategoriesCache.ClearContestCategory(existingEntity.Id);
    }

    protected override Task BeforeEntitySaveOnDeleteAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
        => Task.WhenAll(
            this.contestCategoriesCache.ClearContestCategory(entity.Id),
            this.CascadeDeleteCategories(entity));

    protected override async Task AfterEntitySaveAsync(ContestCategory entity, AdminActionContext actionContext)
        => await this.contestCategoriesCache.ClearMainContestCategoriesCache();

    private async Task CascadeDeleteCategories(ContestCategory contestCategory)
    {
        foreach (var children in contestCategory.Children.ToList())
        {
            await this.CascadeDeleteCategories(children);
        }

        this.contestCategoriesData.Delete(contestCategory);
    }
}