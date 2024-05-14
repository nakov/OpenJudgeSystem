namespace OJS.Services.Administration.Business.LecturersInContests.GridData;

using OJS.Data.Models;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class LecturersInContestsGridDataService : GridDataService<LecturerInContest>, ILecturersInContestsGridDataService
{
    public LecturersInContestsGridDataService(
        IDataService<LecturerInContest> dataService,
        ISortingService sortingService,
        IFilteringService filteringService,
        IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}