namespace OJS.Services.Administration.Business.ContestCategories;

using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using OJS.Services.Administration.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.Linq;
using OJS.Data.Models.Contests;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.ContestCategories;

public class ContestCategoriesBusinessService : AdministrationOperationService<ContestCategory, int, ContestCategoryAdministrationModel>, IContestCategoriesBusinessService
{
    private readonly IContestCategoriesDataService categoriesDataService;
    private readonly IOrderableService<ContestCategory> contestCategoriesOrderableService;
    private readonly IContestCategoriesCacheService contestCategoriesCache;

    public ContestCategoriesBusinessService(
        IContestCategoriesDataService categoriesDataService,
        IOrderableService<ContestCategory> contestCategoriesOrderableService,
        IContestCategoriesCacheService contestCategoriesCache)
    {
        this.categoriesDataService = categoriesDataService;
        this.contestCategoriesCache = contestCategoriesCache;
        this.contestCategoriesOrderableService = contestCategoriesOrderableService;
    }

    public IQueryable<ContestCategory> GetAllVisible() => this.categoriesDataService.GetAllVisible();

    public override async Task<ContestCategoryAdministrationModel> Get(int id)
        => await this.categoriesDataService.GetByIdWithParent(id).Map<ContestCategoryAdministrationModel>();

    public override async Task<ContestCategoryAdministrationModel> Create(ContestCategoryAdministrationModel model)
    {
        var contestCategory = model.Map<ContestCategory>();

        if (model.ParentId == 0)
        {
            contestCategory.ParentId = null;
            contestCategory.Parent = null;
        }

        await this.categoriesDataService.Add(contestCategory);
        await this.categoriesDataService.SaveChanges();

        await this.OrderContestCategoriesByOrderBy(contestCategory);
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        return model;
    }

    public override async Task<ContestCategoryAdministrationModel> Edit(ContestCategoryAdministrationModel model)
    {
        var contestCategory = await this.categoriesDataService.GetByIdQuery(model.Id).FirstOrDefaultAsync();
        contestCategory.MapFrom(model);

        if (model.ParentId == null || model.ParentId == 0)
        {
            contestCategory!.ParentId = null;
            contestCategory!.Parent = null;
        }
        else
        {
            contestCategory!.Parent = await this.categoriesDataService.GetById(model.ParentId);
        }

        await this.contestCategoriesCache.ClearContestCategory(contestCategory.Id);

        this.categoriesDataService.Update(contestCategory!);
        await this.categoriesDataService.SaveChanges();

        await this.OrderContestCategoriesByOrderBy(contestCategory);
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        return model;
    }

    public override async Task Delete(int id)
    {
        var contestCategory = await this.categoriesDataService.GetByIdQuery(id).FirstOrDefaultAsync();

        if (contestCategory is null)
        {
            throw new BusinessServiceException($"Contest Category with Id:{id} not found.");
        }

        this.categoriesDataService.LoadChildrenRecursively(contestCategory);

        await Task.WhenAll(
            this.contestCategoriesCache.ClearContestCategory(contestCategory.Id),
            this.CascadeDeleteCategories(contestCategory));

        this.categoriesDataService.Delete(contestCategory);
        this.contestCategoriesCache.ClearMainContestCategoriesCache();
        await this.categoriesDataService.SaveChanges();
    }

    private async Task OrderContestCategoriesByOrderBy(ContestCategory contestCategory)
    {
        IEnumerable<ContestCategory> contestCategories;

        if (contestCategory.ParentId.HasValue)
        {
            contestCategories = await this.categoriesDataService.GetContestCategoriesByParentId(contestCategory.ParentId);
        }
        else
        {
            contestCategories = await this.categoriesDataService.GetContestCategoriesWithoutParent();
        }

        await this.contestCategoriesOrderableService.ReevaluateOrder(contestCategories);
    }

    private async Task CascadeDeleteCategories(ContestCategory contestCategory)
    {
        foreach (var children in contestCategory.Children.ToList())
        {
            await this.CascadeDeleteCategories(children);
        }

        this.categoriesDataService.Delete(contestCategory);
    }
}