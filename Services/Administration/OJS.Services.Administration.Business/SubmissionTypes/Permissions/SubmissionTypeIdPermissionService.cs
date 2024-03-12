namespace OJS.Services.Administration.Business.SubmissionTypes.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SubmissionTypeIdPermissionService : IEntityPermissionsService<SubmissionType, int>
{
    public async Task<bool> HasPermission(UserInfoModel user, int value, string action) => await Task.FromResult(user.IsAdmin);
}