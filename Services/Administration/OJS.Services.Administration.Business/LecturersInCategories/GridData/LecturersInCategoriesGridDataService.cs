namespace OJS.Services.Administration.Business.LecturersInCategories.GridData;

using OJS.Data.Models;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class LecturersInCategoriesGridDataService : GridDataService<LecturerInContestCategory>, ILecturersInCategoriesGridDataService
{
    public LecturersInCategoriesGridDataService(IDataService<LecturerInContestCategory> dataService, ISortingService sortingService, IFilteringService filteringService)
        : base(dataService, sortingService, filteringService)
    {
    }
}