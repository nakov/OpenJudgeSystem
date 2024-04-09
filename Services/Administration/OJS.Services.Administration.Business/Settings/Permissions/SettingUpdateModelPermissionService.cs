namespace OJS.Services.Administration.Business.Settings.Permissions;

using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SettingUpdateModelPermissionService : IEntityPermissionsService<Setting, SettingAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, SettingAdministrationModel value, string operation) => await Task.FromResult(user.IsAdmin);
}