namespace OJS.Services.Administration.Business.Settings.Permissions;

using OJS.Data.Models;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SettingIdPermissionService : IEntityPermissionsService<Setting, int>
{
    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation) => await Task.FromResult(user.IsAdmin);
}