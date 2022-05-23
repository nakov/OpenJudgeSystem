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
        var categories = await this.contestCategoriesData
            .GetAllVisibleMainOrdered<ContestCategoryTreeViewModel>()
            .ToListAsync();

        await categories.ForEachSequential(async category =>
            await AddChildren(category.Children));

        return categories;
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

    private Task AddChildren(IEnumerable<ContestCategoryTreeViewModel> children)
        => children.ForEachSequential(async child =>
        {
            child.Children = await this.contestCategoriesData
                .GetAllVisibleOrdered()
                .Where(x => x.ParentId == child.Id)
                .MapCollection<ContestCategoryTreeViewModel>()
                .ToListAsync();

            await this.AddChildren(child.Children);
        });
}