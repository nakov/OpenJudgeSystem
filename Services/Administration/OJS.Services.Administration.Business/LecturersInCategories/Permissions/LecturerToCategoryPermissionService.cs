namespace OJS.Services.Administration.Business.LecturersInCategories.Permissions;

using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInCategories;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class LecturerToCategoryPermissionService : IEntityPermissionsService<LecturerInContestCategory, LecturerToCategoryModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, LecturerToCategoryModel value, string operation)
        => await Task.FromResult(user.IsAdmin);
}