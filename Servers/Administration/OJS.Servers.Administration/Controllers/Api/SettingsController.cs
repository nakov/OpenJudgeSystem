namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Data.Models;
using OJS.Services.Administration.Business.Settings;
using OJS.Services.Administration.Business.Settings.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Settings;

public class SettingsController : BaseAdminApiController<Setting, int, SettingInListModel, SettingAdministrationModel>
{
    public SettingsController(
        IGridDataService<Setting> gridDataService,
        ISettingsBusinessService operationService,
        SettingAdministrationModelValidator validator)
        : base(gridDataService, operationService, validator)
    {
    }
}