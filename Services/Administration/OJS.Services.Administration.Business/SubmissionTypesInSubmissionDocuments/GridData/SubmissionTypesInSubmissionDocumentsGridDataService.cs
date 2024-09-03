namespace OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments.GridData;

using OJS.Data.Models;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class SubmissionTypesInSubmissionDocumentsGridDataService : GridDataService<SubmissionTypeInSubmissionDocument>, ISubmissionTypesInSubmissionDocumentsGridDataService
{
    public SubmissionTypesInSubmissionDocumentsGridDataService(
        IDataService<SubmissionTypeInSubmissionDocument> dataService,
        ISortingService sortingService,
        IFilteringService filteringService,
        IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}