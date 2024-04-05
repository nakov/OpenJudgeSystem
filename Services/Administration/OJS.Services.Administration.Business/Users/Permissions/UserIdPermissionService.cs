namespace OJS.Services.Administration.Business.Users.Permissions;

using OJS.Data.Models.Users;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class UserIdPermissionService : IEntityPermissionsService<UserProfile, string>
{
    public async Task<bool> HasPermission(UserInfoModel user, string value, string operation) => await Task.FromResult(user.IsAdmin);
}