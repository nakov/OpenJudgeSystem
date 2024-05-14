namespace OJS.Services.Administration.Business.ProblemGroups.GridData;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class ProblemGroupsGridDataService : GridDataService<ProblemGroup>, IProblemGroupsGridDataService
{
    public ProblemGroupsGridDataService(IProblemGroupsDataService dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}