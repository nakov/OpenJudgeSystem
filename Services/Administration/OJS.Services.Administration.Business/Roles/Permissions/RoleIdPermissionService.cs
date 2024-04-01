namespace OJS.Services.Administration.Business.Roles.Permissions;

using OJS.Data.Models.Users;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class RoleIdPermissionService : IEntityPermissionsService<Role, string>
{
    public async Task<bool> HasPermission(UserInfoModel user, string value, string operation) => await Task.FromResult(user.IsAdmin);
}