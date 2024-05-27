namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using System;
using System.Linq.Expressions;
using AutoCrudAdmin.Models;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.Contests.Categories;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;

public class ContestCategoriesController : BaseAutoCrudAdminController<ContestCategory>
{
    private const string Parent = nameof(ContestCategory.Parent);

    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly IContestCategoriesCacheService contestCategoriesCache;
    private readonly IValidationService<ContestCategoriesValidationServiceModel> contestCategoriesValidationService;
    private readonly IOrderableService<ContestCategory> contestCategoriesOrderableService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesData,
        IContestCategoriesCacheService contestCategoriesCache,
        IValidationService<ContestCategoriesValidationServiceModel> contestCategoriesValidationService,
        IOrderableService<ContestCategory> contestCategoriesOrderableService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.contestCategoriesData = contestCategoriesData;
        this.contestCategoriesCache = contestCategoriesCache;
        this.contestCategoriesValidationService = contestCategoriesValidationService;
        this.contestCategoriesOrderableService = contestCategoriesOrderableService;
    }

    protected override Expression<Func<ContestCategory, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override Task BeforeEntitySaveOnCreateAsync(ContestCategory entity, AdminActionContext actionContext)
    {
        if (entity.ParentId == 0)
        {
            entity.ParentId = null;
        }

        var validationModel = new ContestCategoriesValidationServiceModel
        {
            OrderBy = entity.OrderBy,
            Name = entity.Name,
        };

        this.contestCategoriesValidationService
            .GetValidationResult(validationModel)
            .VerifyResult();

        return base.BeforeEntitySaveOnCreateAsync(entity, actionContext);
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        ContestCategory existingEntity,
        ContestCategory newEntity,
        AdminActionContext actionContext)
    {
        if (newEntity.ParentId == 0)
        {
            newEntity.ParentId = null;
            newEntity.Parent = null;
        }
        else
        {
            newEntity.Parent = await this.contestCategoriesData.GetById(newEntity.ParentId);
        }

        var validationModel = new ContestCategoriesValidationServiceModel
        {
            OrderBy = newEntity.OrderBy,
            Name = newEntity.Name,
        };

        this.contestCategoriesValidationService
            .GetValidationResult(validationModel)
            .VerifyResult();

        await this.contestCategoriesCache.ClearContestCategoryParentsAndChildren(existingEntity.Id);
    }

    protected override Task BeforeEntitySaveOnDeleteAsync(
        ContestCategory entity,
        AdminActionContext actionContext)
    {
        this.contestCategoriesData.LoadChildrenRecursively(entity);

        return Task.WhenAll(
            this.contestCategoriesCache.ClearContestCategoryParentsAndChildren(entity.Id),
            this.CascadeDeleteCategories(entity));
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

    protected override Expression<Func<ContestCategory, bool>>? GetMasterGridFilter()
    {
        if (this.TryGetEntityIdForStringColumnFilter(Parent, out var parentName))
        {
            return cc => cc.Parent!.Name == parentName;
        }

        return base.MasterGridFilter;
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