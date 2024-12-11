namespace OJS.Services.Administration.Business.UsersMentors.Permissions;

using System.Threading.Tasks;
using OJS.Data.Models.Mentor;
using OJS.Services.Common.Models.Users;

public class UserMentorIdPermissionsService : IEntityPermissionsService<UserMentor, string>
{
    public Task<bool> HasPermission(UserInfoModel user, string value, string operation)
        => Task.FromResult(user.IsAdmin);
}