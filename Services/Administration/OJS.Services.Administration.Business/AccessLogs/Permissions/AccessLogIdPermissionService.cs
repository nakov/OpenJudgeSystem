namespace OJS.Services.Administration.Business.AccessLogs.Permissions;

using System.Threading.Tasks;
using OJS.Data.Models;
using OJS.Services.Common.Models.Users;

public class AccessLogIdPermissionService : IEntityPermissionsService<AccessLog, int>
{
    public Task<bool> HasPermission(UserInfoModel user, int value, string operation)
        => Task.FromResult(user.IsAdmin);
}