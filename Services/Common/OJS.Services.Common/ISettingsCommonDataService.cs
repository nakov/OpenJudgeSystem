namespace OJS.Services.Common;

using Data;
using Models.Settings;
using OJS.Data.Models;
using System.Threading.Tasks;

public interface ISettingsCommonDataService : IDataService<Setting>
{
    Task AddIfNotExists(SettingServiceModel model);
}