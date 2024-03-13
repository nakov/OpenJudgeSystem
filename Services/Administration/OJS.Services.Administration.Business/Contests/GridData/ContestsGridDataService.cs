namespace OJS.Services.Administration.Business.Contests.GridData;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class ContestsGridDataService : GridDataService<Contest>, IContestsGridDataService
{
    public ContestsGridDataService(IContestsDataService dataService, ISortingService sortingService, IFilteringService filteringService)
        : base(dataService, sortingService, filteringService)
    {
    }
}