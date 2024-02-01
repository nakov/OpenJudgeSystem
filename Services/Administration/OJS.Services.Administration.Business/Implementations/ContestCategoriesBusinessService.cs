namespace OJS.Services.Administration.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Administration.Data;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class ContestCategoriesBusinessService : GridDataService<ContestCategory>, IContestCategoriesBusinessService
{
    private readonly IContestCategoriesDataService categoriesDataService;
    private readonly IOrderableService<ContestCategory> contestCategoriesOrderableService;

    public ContestCategoriesBusinessService(
        IContestCategoriesDataService categoriesDataService,
        IOrderableService<ContestCategory> contestCategoriesOrderableService)
        : base(categoriesDataService)
    {
        this.categoriesDataService = categoriesDataService;
        this.contestCategoriesOrderableService = contestCategoriesOrderableService;
    }

    public IQueryable<ContestCategory> GetAllVisible() => this.categoriesDataService.GetAllVisible();

    public async Task Create(ContestCategoryAdministrationModel model)
    {
        var contestCategory = model.Map<ContestCategory>();

        if (model.ParentId == 0)
        {
            contestCategory.ParentId = null;
            contestCategory.Parent = null;
        }

        //additional business logic when adding contest category

        await this.categoriesDataService.Add(contestCategory);
        await this.categoriesDataService.SaveChanges();

        await this.OrderContestCategoriesByOrderBy(contestCategory);
        //this.contestCategoriesCache.ClearMainContestCategoriesCache();
    }

    public async Task<ContestCategoryAdministrationModel> GetById(int id)
        => await this.categoriesDataService.GetByIdWithParent(id).Map<ContestCategoryAdministrationModel>();

    public async Task Edit(ContestCategoryAdministrationModel model, int id)
    {
        var contestCategory = await this.categoriesDataService.GetByIdQuery(id).FirstOrDefaultAsync();

        //prob unnesesary
        model.Id = id;

        contestCategory.MapFrom(model);

        if (model.ParentId == 0)
        {
            contestCategory!.ParentId = null;
            contestCategory!.Parent = null;
        }
        else
        {
            contestCategory!.Parent = await this.categoriesDataService.GetById(model.ParentId);
        }

        // var validationModel = new ContestCategoriesValidationServiceModel
        // {
        //     OrderBy = newEntity.OrderBy,
        //     Name = newEntity.Name,
        // };
        //
        // this.contestCategoriesValidationService
        //     .GetValidationResult(validationModel)
        //     .VerifyResult();
        //

        //await this.contestCategoriesCache.ClearContestCategory(existingEntity.Id);

        //logic for removing/ adding parent?

        this.categoriesDataService.Update(contestCategory!);
        await this.categoriesDataService.SaveChanges();

        await this.OrderContestCategoriesByOrderBy(contestCategory);
        //this.contestCategoriesCache.ClearMainContestCategoriesCache();
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