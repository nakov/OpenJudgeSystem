namespace OJS.Services.Administration.Business.Checkers.Permissions;

using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Models.Checkers;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class CheckerUpdateModelPermissionService : IEntityPermissionsService<Checker, CheckerAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, CheckerAdministrationModel value, string operation)
        => await Task.FromResult(user.IsAdmin);
}