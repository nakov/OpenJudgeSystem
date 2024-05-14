namespace OJS.Services.Administration.Business.Problems.GridData;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class ProblemsGridDataService : GridDataService<Problem>, IProblemsGridDataService
{
    public ProblemsGridDataService(IProblemsDataService dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}