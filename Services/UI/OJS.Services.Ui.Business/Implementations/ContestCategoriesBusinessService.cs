namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesBusinessService : IContestCategoriesBusinessService
{
    private readonly IContestCategoriesDataService contestCategoriesData;

    public ContestCategoriesBusinessService(
        IContestCategoriesDataService contestCategoriesData)
        => this.contestCategoriesData = contestCategoriesData;

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetTree()
    {
        var allCategories = await this.contestCategoriesData
            .GetAllVisible()
            .MapCollection<ContestCategoryTreeViewModel>()
            .ToListAsync();

        var mainCategories = allCategories
            .Where(c => !c.ParentId.HasValue)
            .OrderBy(c => c.OrderBy)
            .ToList();

        mainCategories.ForEach(category =>
            AddChildren(category.Children, allCategories));

        return mainCategories;
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain()
        => await this.contestCategoriesData
            .GetAllVisibleMainOrdered<ContestCategoryListViewModel>()
            .ToListAsync();

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetAllSubcategories(int? categoryId)
        => await this.contestCategoriesData
            .GetAllVisibleOrdered()
            .Where(cc => categoryId.HasValue ? cc.ParentId == categoryId : cc.ParentId == null)
            .OrderBy(cc => cc.OrderBy)
            .MapCollection<ContestCategoryListViewModel>()
            .ToListAsync();

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

    private void AddChildren(
        IEnumerable<ContestCategoryTreeViewModel> children,
        ICollection<ContestCategoryTreeViewModel> allCategories)
        => children.ForEach(child =>
        {
            child.Children = allCategories
                .OrderBy(x => x.OrderBy)
                .Where(x => x.ParentId == child.Id)
                .ToList();

            this.AddChildren(child.Children, allCategories);
        });
}