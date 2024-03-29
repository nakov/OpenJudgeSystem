namespace OJS.Services.Administration.Business.LecturersInContests.Permissions;

using OJS.Data.Models;
using OJS.Services.Administration.Models.LecturerInContests;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class LecturerToContestPermissionService : IEntityPermissionsService<LecturerInContest, LecturerToContestModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, LecturerToContestModel value, string operation)
        => await Task.FromResult(user.IsAdmin);
}