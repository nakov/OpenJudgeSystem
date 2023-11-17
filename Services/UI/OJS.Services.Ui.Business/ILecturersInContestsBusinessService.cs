namespace OJS.Services.Ui.Business;

using OJS.Data.Models.Contests;
using System.Threading.Tasks;
using OJS.Services.Common.Models.Users;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    bool IsUserAdminOrLecturerInContest(Contest? contest);

    bool IsUserLecturerInContest(Contest contest);

    bool IsUserLecturerInContest(int contestId, string userId);

    bool IsUserAdminOrLecturerInContest(int contestId, UserInfoModel user);
}