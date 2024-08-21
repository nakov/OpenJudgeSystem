namespace OJS.Services.Administration.Business.SubmissionTypeDocuments.GridData;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class SubmissionTypeDocumentsGridDataService : GridDataService<SubmissionTypeDocument>, ISubmissionTypeDocumentsGridDataService
{
    public SubmissionTypeDocumentsGridDataService(
        ISubmissionTypeDocumentsDataService dataService,
        ISortingService sortingService,
        IFilteringService filteringService,
        IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}