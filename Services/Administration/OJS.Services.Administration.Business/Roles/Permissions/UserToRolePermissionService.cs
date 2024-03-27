namespace OJS.Services.Administration.Business.Roles.Permissions;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class UserToRolePermissionService : IEntityPermissionsService<Role, UserToRoleModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, UserToRoleModel value, string operation) => await Task.FromResult(user.IsAdmin);
}