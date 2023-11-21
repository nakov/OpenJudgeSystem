namespace OJS.Services.Administration.Business.Implementations;

using System.Linq;
using System;
using System.Linq.Expressions;
using OJS.Data.Models.Tests;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;

public class LecturerContestPrivilegesBusinessService : ILecturerContestPrivilegesBusinessService
{
    public Expression<Func<Contest, bool>> GetContestUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return contest => true;
        }

        Expression<Func<Contest, bool>> contestExpression =
            contest => contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                       contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == userId);

        return contestExpression;
    }

    public Expression<Func<Submission, bool>> GetSubmissionsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return submission => true;
        }

        Expression<Func<Submission, bool>> contestExpression =
            submission =>
                submission.Problem.ProblemGroup.Contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                submission.Problem.ProblemGroup.Contest.Category!.LecturersInContestCategories.Any(cl =>
                    cl.LecturerId == userId);

        return contestExpression;
    }

    public Expression<Func<Problem, bool>> GetProblemsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return problem => true;
        }

        Expression<Func<Problem, bool>> expression =
            problem => problem.ProblemGroup.Contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                       problem.ProblemGroup.Contest.Category!.LecturersInContestCategories.Any(cl =>
                           cl.LecturerId == userId);

        return expression;
    }

    public Expression<Func<ProblemGroup, bool>> GetProblemGroupsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return problemGroup => true;
        }

        Expression<Func<ProblemGroup, bool>> expression =
            problemGroup => problemGroup.Contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                            problemGroup.Contest.Category!.LecturersInContestCategories.Any(cl =>
                                cl.LecturerId == userId);

        return expression;
    }

    public Expression<Func<ProblemResource, bool>> GetProblemResourcesUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return problemResource => true;
        }

        Expression<Func<ProblemResource, bool>> expression =
            problemResource => problemResource.Problem.ProblemGroup.Contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                               problemResource.Problem.ProblemGroup.Contest.Category!.LecturersInContestCategories.Any(cl =>
                                cl.LecturerId == userId);

        return expression;
    }

    public Expression<Func<Test, bool>> GetTestsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin)
    {
        if (isUserAdmin)
        {
            return test => true;
        }

        Expression<Func<Test, bool>> expression =
            test => test.Problem.ProblemGroup.Contest.LecturersInContests.Any(c => c.LecturerId == userId) ||
                    test.Problem.ProblemGroup.Contest.Category!.LecturersInContestCategories.Any(cl =>
                                   cl.LecturerId == userId);

        return expression;
    }
}