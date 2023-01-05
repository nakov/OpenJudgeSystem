using X.PagedList;

namespace OJS.Services.Ui.Business.Implementations;

using FluentExtensions.Extensions;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure.Extensions;
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
        var allCategories = await this.GetAlVisible<ContestCategoryTreeViewModel>().ToListAsync();

        var mainCategories = allCategories
            .Where(c => !c.ParentId.HasValue)
            .OrderBy(c => c.OrderBy)
            .ToList();

        var graph = BuildGraph(allCategories);

        allCategories.ForEach(category =>
        {
            category.Children = category.Children.OrderBy(c => c.OrderBy);
            AddChildren(category.Children, allCategories, category.AllowedStrategyTypes, graph);
            category.AllowedStrategyTypes = category.AllowedStrategyTypes
                .DistinctBy(c => c.Id)
                .ToList();
        });

        return mainCategories;
    }

    public async Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain()
        => await this.contestCategoriesData
            .GetAllVisibleMainOrdered<ContestCategoryListViewModel>()
            .ToListAsync();

    public async Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllSubcategories(int categoryId)
    {
        var allCategories = await this.GetAlVisible<ContestCategoryTreeViewModel>().ToListAsync();

        var result = new List<ContestCategoryTreeViewModel>();

        var directSubcategories = allCategories
            .Where(c => c.ParentId == categoryId)
            .OrderBy(c => c.OrderBy)
            .ToList();

        directSubcategories
            .ForEach(c => this.GetWithChildren(c, c.Children, allCategories, result));

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

    private void AddChildren(IEnumerable<ContestCategoryTreeViewModel> children,
        ICollection<ContestCategoryTreeViewModel> allCategories,
        ICollection<AllowedContestStrategiesServiceModel> parentCategoryAllowedStrategyTypes,
        IReadOnlyDictionary<int, List<AllowedContestStrategiesServiceModel>> graph)
        => children
            .ForEach(child =>
            {
                GetChildrenAllowedStrategyTypes(child, graph);

                child.Children = allCategories
                    .OrderBy(x => x.OrderBy)
                    .Where(x => x.ParentId == child.Id)
                    .ToList();

                parentCategoryAllowedStrategyTypes.AddRange(child.AllowedStrategyTypes);
                this.AddChildren(child.Children, allCategories, parentCategoryAllowedStrategyTypes, graph);
            });

    private void GetWithChildren(
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

                this.GetWithChildren(childNode, grandChildren, allCategories, result);
            });
    }

    private Dictionary<int, List<AllowedContestStrategiesServiceModel>> BuildGraph(
        IEnumerable<ContestCategoryTreeViewModel> allCategories)
    {
        var graph = new Dictionary<int, List<AllowedContestStrategiesServiceModel>>();

        allCategories
            .Where(category => category.ParentId.HasValue)
            .ForEach(category =>
            {
                if (!graph.ContainsKey(category.Id))
                {
                    graph[category.Id] = new List<AllowedContestStrategiesServiceModel>();
                }

                graph[category.Id].AddRange(category.AllowedStrategyTypes);
            });

        return graph;
    }

    private static void GetChildrenAllowedStrategyTypes(
        ContestCategoryTreeViewModel category,
        IReadOnlyDictionary<int, List<AllowedContestStrategiesServiceModel>> graph)
    {
        var children = graph[category.Id];

        category.Children
            .ForEach(c => GetChildrenAllowedStrategyTypes(c, graph));

        category.AllowedStrategyTypes = children.DistinctBy(c => c.Id).ToList();
    }

    private Task<IEnumerable<T>> GetAlVisible<T>()
        => this.contestCategoriesData
            .GetAllVisible()
            .MapCollection<T>()
            .ToEnumerableAsync();
}