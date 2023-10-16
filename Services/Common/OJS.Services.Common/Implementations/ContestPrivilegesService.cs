namespace OJS.Services.Common.Implementations;

using System.Linq;
using System.Threading.Tasks;

using OJS.Services.Common.Models.Users;
using OJS.Data.Models.Contests;

public class ContestPrivilegesService : IContestPrivilegesService
{
    public Task<bool> GetUserIsLecturerInContestOrCategory(Contest contest, UserInfoModel user)
    {
        var userIsLecturerInContest = contest
            .LecturersInContests
            .FirstOrDefault(lc => lc.LecturerId == user.Id) != null;

        var userIsLecturerInCategory =
            contest
                .Category?
                .LecturersInContestCategories
                .FirstOrDefault(l => l.LecturerId == user.Id) != null;

        return Task.FromResult(user.IsAdmin || (userIsLecturerInContest || userIsLecturerInCategory));
    }
}