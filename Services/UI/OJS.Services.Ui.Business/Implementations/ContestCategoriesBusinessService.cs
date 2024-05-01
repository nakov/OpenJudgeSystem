namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesBusinessService : IContestCategoriesBusinessService
{
    private readonly IContestCategoriesDataService contestCategoriesData;

    public ContestCategoriesBusinessService(IContestCategoriesDataService contestCategoriesData)
        => this.contestCategoriesData = contestCategoriesData;

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetTree()
    {
        var allCategories =
            await this.contestCategoriesData.GetAllVisible<ContestCategoryTreeViewModel>()
                .OrderByAsync(x => x.OrderBy)
                .ToListAsync();

        var categoriesWithChildren = FillChildren(allCategories);

        var mainCategories = categoriesWithChildren
            .Where(c => !c.ParentId.HasValue)
            .OrderBy(c => c.OrderBy)
            .ToList();

        mainCategories.ForEach(this.FillAllowedStrategyTypes);

        return mainCategories;
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain()
        => await this.contestCategoriesData
            .GetAllVisibleMainOrdered<ContestCategoryListViewModel>()
            .ToListAsync();

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllSubcategories(int categoryId)
    {
        var allCategories = await this.contestCategoriesData
            .GetAllVisible<ContestCategoryTreeViewModel>()
            .ToListAsync();

        var result = new List<ContestCategoryTreeViewModel>();

        var directSubcategories = allCategories
            .Where(c => c.ParentId == categoryId)
            .OrderBy(c => c.OrderBy)
            .ToList();

        directSubcategories
            .ForEach(c => GetWithChildren(c, c.Children, allCategories, result));

        return result;
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetAllParentCategories(int categoryId)
    {
        var categories = new List<ContestCategoryListViewModel>();
        var category = await this.contestCategoriesData.OneById(categoryId);

        while (category != null)
        {
            categories.Add(category.Map<ContestCategoryListViewModel>());

            category = category.Parent;
        }

        categories.Reverse();

        return categories;
    }

    public bool IsCategoryChildOfInvisibleParentRecursive(int? categoryId)
    {
        if (categoryId == null)
        {
            return false;
        }

        var categoryWithParent = this.contestCategoriesData
            .GetByIdQuery(categoryId.Value).Include(c => c.Parent).FirstOrDefault();

        if (categoryWithParent?.Parent != null)
        {
            if (categoryWithParent.Parent.IsVisible == false)
            {
                return true;
            }

            return this.IsCategoryChildOfInvisibleParentRecursive(categoryWithParent.Parent.Id);
        }

        return false;
    }

    private static IEnumerable<ContestCategoryTreeViewModel> FillChildren(
        IEnumerable<ContestCategoryTreeViewModel> allCategories)
    {
        var categoriesList = allCategories.ToList();

        return categoriesList
            .Mutate(category =>
                category.Children = categoriesList.Where(x => x.ParentId == category.Id));
    }

    private static void GetWithChildren(
        ContestCategoryTreeViewModel category,
        IEnumerable<ContestCategoryTreeViewModel> children,
        ICollection<ContestCategoryTreeViewModel> allCategories,
        ICollection<ContestCategoryTreeViewModel> result)
    {
        result.Add(category);

        children
            .OrderBy(c => c.OrderBy)
            .ForEach(childNode =>
            {
                var grandChildren = allCategories
                    .Where(x => x.ParentId == childNode.Id)
                    .ToList();

                result.AddRange(grandChildren);

                GetWithChildren(childNode, grandChildren, allCategories, result);
            });
    }

    private void FillAllowedStrategyTypes(ContestCategoryTreeViewModel category)
    {
        category.Children.ForEach(this.FillAllowedStrategyTypes);

        category.AllowedStrategyTypes = this.contestCategoriesData.GetAllowedStrategyTypesById<AllowedContestStrategiesServiceModel>(category.Id);

        category.AllowedStrategyTypes = category.AllowedStrategyTypes.Concat(
                category.Children.SelectMany(c => c.AllowedStrategyTypes))
                    .DistinctBy(x => x.Id)
                    .ToList();
    }
}