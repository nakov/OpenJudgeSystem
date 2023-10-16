namespace OJS.Services.Common;

using System.Threading.Tasks;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Users;

using SoftUni.Services.Infrastructure;

public interface IContestPrivilegesService : IService
{
    Task<bool> GetUserIsLecturerInContestOrCategory(Contest contest, UserInfoModel user);
}