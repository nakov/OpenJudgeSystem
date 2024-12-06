namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models;
using OJS.Services.Administration.Business.AccessLogs;
using OJS.Services.Administration.Business.AccessLogs.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.AccessLogs;
using OJS.Services.Common.Data;

public class AccessLogsController : BaseAdminApiController<AccessLog, int, AccessLogInListModel, AccessLogAdministrationModel>
{
    public AccessLogsController(
        IGridDataService<AccessLog> gridDataService,
        IAccessLogsBusinessService accessLogsBusinessService,
        AccessLogAdministrationModelValidator validator,
        IDataService<AccessLog> accessLogData)
        : base(gridDataService, accessLogsBusinessService, validator, accessLogData)
    {
    }
}