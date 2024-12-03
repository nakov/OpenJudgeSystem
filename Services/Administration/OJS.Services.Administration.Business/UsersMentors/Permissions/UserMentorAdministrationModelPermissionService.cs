namespace OJS.Services.Administration.Business.UsersMentors.Permissions;

using System.Threading.Tasks;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Models.UsersMentors;
using OJS.Services.Common.Models.Users;

public class UserMentorAdministrationModelPermissionService : IEntityPermissionsService<UserMentor, UserMentorAdministrationModel>
{
    public Task<bool> HasPermission(UserInfoModel user, UserMentorAdministrationModel value, string operation)
        => Task.FromResult(user.IsAdmin);
}