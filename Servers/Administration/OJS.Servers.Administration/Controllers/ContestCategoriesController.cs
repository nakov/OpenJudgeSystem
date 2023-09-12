namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Exceptions;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.Contests.Categories;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;

using GlobalResource = OJS.Common.Resources.ContestCategoriesController;

public class ContestCategoriesController : BaseAutoCrudAdminController<ContestCategory>
{
    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly IContestCategoriesCacheService contestCategoriesCache;
    private readonly IValidationService<ContestCategoriesValidationServiceModel> contestCategoriesValidationService;
    private readonly IOrderableService<ContestCategory> contestCategoriesOrderableService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesData,
        IContestCategoriesCacheService contestCategoriesCache,
        IValidationService<ContestCategoriesValidationServiceModel> contestCategoriesValidationService,
        IOrderableService<ContestCategory> contestCategoriesOrderableService)
    {
        this.contestCategoriesData = contestCategoriesData;
        this.contestCategoriesCache = contestCategoriesCache;
        this.contestCategoriesValidationService = contestCategoriesValidationService;
        this.contestCategoriesOrderableService = contestCategoriesOrderableService;
    }

    protected override Task BeforeEntitySaveOnCreateAsync(ContestCategory entity, AdminActionContext actionContext)
    {
        var validationModel = new ContestCategoriesValidationServiceModel
        {
            OrderBy = entity.OrderBy,
        };

        this.contestCategoriesValidationService
            .GetValidationResult(validationModel)
            .VerifyResult();

        return Task.CompletedTask;
    }

    protected override Task BeforeEntitySaveOnCreateAsync(ContestCategory entity, AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(entity.Name))
        {
            throw new BusinessServiceException(GlobalResource.RequiredName);
        }

        if (entity.ParentId == 0)
        {
            entity.ParentId = null;
        }

        return base.BeforeEntitySaveOnCreateAsync(entity, actionContext);
    }

    protected override Task BeforeEntitySaveOnCreateAsync(ContestCategory entity, AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(entity.Name))
        {
            throw new BusinessServiceException(GlobalResource.RequiredName);
        }

        if (entity.ParentId == 0)
        {
            entity.ParentId = null;
        }

        return base.BeforeEntitySaveOnCreateAsync(entity, actionContext);
    }

    protected override Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
    {
        var validationModel = new ContestCategoriesValidationServiceModel { OrderBy = newEntity.OrderBy };

        this.contestCategoriesValidationService
            .GetValidationResult(validationModel)
            .VerifyResult();

        return this.contestCategoriesCache.ClearContestCategory(existingEntity.Id);
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(newEntity.Name))
        {
            throw new BusinessServiceException(GlobalResource.RequiredName);
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

    protected override async Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
    {
        if (string.IsNullOrEmpty(newEntity.Name))
        {
            throw new BusinessServiceException(GlobalResource.RequiredName);
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

    protected override async Task AfterEntitySaveOnCreateAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        await this.OrderContestCategoriesByOrderBy(entity);
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
    }

    protected override async Task AfterEntitySaveOnEditAsync(
        ContestCategory oldEntity,
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        await this.OrderContestCategoriesByOrderBy(entity);
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
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

    private async Task OrderContestCategoriesByOrderBy(ContestCategory contestCategory)
    {
        IEnumerable<ContestCategory> contestCategories;
        if (contestCategory.ParentId.HasValue)
        {
            contestCategories = await this.contestCategoriesData.GetContestCategoriesByParentId(contestCategory.ParentId);
        }
        else
        {
            contestCategories = await this.contestCategoriesData.GetContestCategoriesWithoutParent();
        }

        await this.contestCategoriesOrderableService.ReevaluateOrder(contestCategories);
    }
}