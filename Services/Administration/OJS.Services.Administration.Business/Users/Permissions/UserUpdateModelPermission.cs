namespace OJS.Services.Administration.Business.Users.Permissions;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Users;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class UserUpdateModelPermission : IEntityPermissionsService<UserProfile, UserAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, UserAdministrationModel value, string operation) => await Task.FromResult(user.IsAdmin);
}