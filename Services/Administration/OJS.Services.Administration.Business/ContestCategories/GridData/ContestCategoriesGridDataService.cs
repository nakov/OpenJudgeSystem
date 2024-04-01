namespace OJS.Services.Administration.Business.ContestCategories.GridData;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class ContestCategoriesGridDataService : GridDataService<ContestCategory>, IContestCategoriesGridDataService
{
    public ContestCategoriesGridDataService(IContestCategoriesDataService dataService, ISortingService sortingService, IFilteringService filteringService)
        : base(dataService, sortingService, filteringService)
    {
    }
}