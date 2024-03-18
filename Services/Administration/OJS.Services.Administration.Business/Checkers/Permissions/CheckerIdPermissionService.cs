namespace OJS.Services.Administration.Business.Checkers.Permissions;

using OJS.Data.Models.Checkers;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class CheckerIdPermissionService : IEntityPermissionsService<Checker, int>
{
    public async Task<bool> HasPermission(UserInfoModel user, int value, string action)
        => await Task.FromResult(user.IsAdmin);
}