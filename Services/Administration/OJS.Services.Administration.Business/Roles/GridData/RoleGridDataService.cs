namespace OJS.Services.Administration.Business.Roles.GridData;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class RoleGridDataService : GridDataService<Role>, IRoleGridDataService
{
    public RoleGridDataService(
        IDataService<Role> dataService,
        ISortingService sortingService,
        IFilteringService filteringService,
        IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}