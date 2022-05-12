namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common;
using OJS.Services.Common.Models.Cache;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ContestCategoriesBusinessService : IContestCategoriesBusinessService
{
    private readonly ICacheItemsProviderService cacheItemsProvider;

    public ContestCategoriesBusinessService(ICacheItemsProviderService cacheItemsProvider)
        => this.cacheItemsProvider = cacheItemsProvider;

    public Task<IEnumerable<ContestCategoryTreeViewModel>> GetTree()
        => this.cacheItemsProvider.GetAllContestCategoriesTree();

    public Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain()
        => this.cacheItemsProvider.GetMainContestCategories();

    public Task<IEnumerable<ContestCategoryListViewModel>> GetAllSubcategories(int categoryId)
        => this.cacheItemsProvider.GetContestSubCategoriesList(categoryId);

    public Task<IEnumerable<ContestCategoryListViewModel>> GetAllParentCategories(int categoryId)
        => this.cacheItemsProvider.GetContestCategoryParentsList(categoryId);
}