namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Linq.Expressions;
using System.Linq;

public class ContestsBusinessService : IContestsBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly Business.IUserProviderService userProvider;

    public ContestsBusinessService(
        IContestsDataService contestsData,
        Business.IUserProviderService userProvider)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
    }

    public async Task<bool> UserHasContestPermissions(
        int contestId,
        string? userId,
        bool isUserAdmin)
        => !string.IsNullOrWhiteSpace(userId) &&
           (isUserAdmin || await this.contestsData.IsUserLecturerInByContestAndUser(contestId, userId));

    public async Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>(string? filterName)
        where TServiceModel : class
    {
        var user = this.userProvider.GetCurrentUser();

        Expression<Func<Contest, bool>> filterExpression = null!;
        if (!string.IsNullOrEmpty(filterName))
        {
            var parameter = Expression.Parameter(typeof(Contest), "x");
            var property = typeof(Contest).GetProperty("Name");

            if (property != null)
            {
                var propertyAccess = Expression.Property(parameter, property);
                var constant = Expression.Constant(filterName, typeof(string));
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var containsExpression = Expression.Call(propertyAccess, containsMethod!, constant);

                filterExpression = Expression.Lambda<Func<Contest, bool>>(containsExpression, parameter);
            }
        }

        var test = user.IsAdmin
            ? await this.contestsData.AllTo<TServiceModel>(filterExpression)
            : await this.contestsData.GetAllByLecturer(user.Id)
                .Where(x => x.Name!.Contains(filterName ?? string.Empty))
                .MapCollection<TServiceModel>()
                .ToListAsync();

        return test;
    }
}