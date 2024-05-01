namespace OJS.Services.Administration.Business;

using System;
using System.Linq.Expressions;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure;

public interface ILecturerContestPrivilegesBusinessService : IService
{
    Expression<Func<Contest, bool>> GetContestUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);

    Expression<Func<Submission, bool>> GetSubmissionsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);

    Expression<Func<Problem, bool>> GetProblemsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);

    Expression<Func<ProblemResource, bool>> GetProblemResourcesUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);

    Expression<Func<ProblemGroup, bool>> GetProblemGroupsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);

    Expression<Func<Test, bool>> GetTestsUserPrivilegesExpression(
        string? userId,
        bool isUserAdmin);
}