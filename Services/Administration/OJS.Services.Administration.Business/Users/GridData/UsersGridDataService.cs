namespace OJS.Services.Administration.Business.Users.GridData;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Data.Excel;
using OJS.Services.Administration.Data.Implementations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Pagination;

public class UsersGridDataService : GridDataService<UserProfile>, IUsersGridDataService
{
    public UsersGridDataService(IDataService<UserProfile> dataService, ISortingService sortingService, IFilteringService filteringService, IExcelService excelService)
        : base(dataService, sortingService, filteringService, excelService)
    {
    }
}