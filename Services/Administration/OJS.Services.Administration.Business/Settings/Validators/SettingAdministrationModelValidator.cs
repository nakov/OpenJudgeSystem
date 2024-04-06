namespace OJS.Services.Administration.Business.Settings.Validators;

using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class SettingAdministrationModelValidator : BaseAdministrationModelValidator<SettingAdministrationModel, int, Setting>
{
    public SettingAdministrationModelValidator(IDataService<Setting> dataService)
        : base(dataService)
    {
    }
}