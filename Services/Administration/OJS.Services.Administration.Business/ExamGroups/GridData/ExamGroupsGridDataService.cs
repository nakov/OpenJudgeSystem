namespace OJS.Services.Administration.Business.ExamGroups.GridData;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class ExamGroupsGridDataService : GridDataService<ExamGroup>, IExamGroupsGridDataService
{
    public ExamGroupsGridDataService(IDataService<ExamGroup> dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}