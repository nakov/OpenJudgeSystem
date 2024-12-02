namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models;
using OJS.Services.Administration.Business.Settings;
using OJS.Services.Administration.Business.Settings.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;

public class SettingsController : BaseAdminApiController<Setting, int, SettingInListModel, SettingAdministrationModel>
{
    public SettingsController(
        IGridDataService<Setting> gridDataService,
        ISettingsBusinessService operationService,
        SettingAdministrationModelValidator validator,
        IDataService<AccessLog> accessLogsData)
        : base(gridDataService, operationService, validator, accessLogsData)
    {
    }
}