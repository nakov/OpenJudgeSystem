namespace OJS.Services.Administration.Business.Submissions.GridData;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data.Pagination;

public class SubmissionsGridDataService : GridDataService<Submission>, ISubmissionsGridDataService
{
    public SubmissionsGridDataService(ISubmissionsDataService dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}