namespace OJS.Services.Administration.Business.Settings;

using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using System.Threading.Tasks;

public interface ISettingsBusinessService : IAdministrationOperationService<Setting, int, SettingAdministrationModel>
{
    Task<SettingAdministrationModel> GetByKey(string settingKey);
}