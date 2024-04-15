namespace OJS.Services.Administration.Business.Tests.GridData;

using OJS.Data.Models.Tests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class TestsGridDataService : GridDataService<Test>, ITestsGridDataService
{
    public TestsGridDataService(ITestsDataService dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}