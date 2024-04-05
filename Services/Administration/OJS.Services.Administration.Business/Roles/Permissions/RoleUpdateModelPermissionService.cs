namespace OJS.Services.Administration.Business.Roles.Permissions;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class RoleUpdateModelPermissionService : IEntityPermissionsService<Role, RoleAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, RoleAdministrationModel value, string operation)
        => await Task.FromResult(user.IsAdmin);
}