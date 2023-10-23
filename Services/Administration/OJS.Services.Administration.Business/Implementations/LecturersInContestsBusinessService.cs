namespace OJS.Services.Administration.Business.Implementations;

using System.Linq;
using System;
using System.Linq.Expressions;
using OJS.Data.Models.Contests;

public class LecturersInContestsBusinessService : ILecturersInContestsBusinessService
{
    public static bool UserHasContestPrivileges(
        Contest contest,
        string? userId,
        bool isUserAdmin)
        => isUserAdmin || IsUserLecturerInContest(contest, userId!);

    public Expression<Func<Contest, bool>> GetUserPrivilegesExpression(
        Contest entity,
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return contest => true;
        }

        Expression<Func<Contest, bool>> contestExpression =
            contest => UserHasContestPrivileges(contest, userId, isUserAdmin);

        return contestExpression;
    }

    private static bool IsUserLecturerInContest(Contest contest, string userId)
        => contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
        contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);
}