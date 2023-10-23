namespace OJS.Services.Administration.Business;

using System;
using System.Linq.Expressions;
using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    Expression<Func<Contest, bool>> GetUserPrivilegesExpression(
        Contest entity,
        string? userId,
        bool isUserAdmin);
}