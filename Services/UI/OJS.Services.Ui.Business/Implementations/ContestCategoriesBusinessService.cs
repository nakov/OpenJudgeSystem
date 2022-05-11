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

    public Task<IEnumerable<CategoryMenuItemViewModel>> GetAllMain()
        => Task.FromResult(this.cacheItemsProvider.GetMainContestCategories());

    public Task<IEnumerable<ContestCategoryListViewModel>> GetAllByParent(int parentCategoryId)
        => throw new System.NotImplementedException();
}