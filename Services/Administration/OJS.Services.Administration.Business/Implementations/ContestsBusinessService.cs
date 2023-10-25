namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;

public class ContestsBusinessService : IContestsBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly Business.IUserProviderService userProvider;
    private readonly IContestCategoriesDataService contestCategoriesData;

    public ContestsBusinessService(
        IContestsDataService contestsData,
        Business.IUserProviderService userProvider,
        IContestCategoriesDataService contestCategoriesData)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
        this.contestCategoriesData = contestCategoriesData;
    }

    public async Task<bool> UserHasContestPermissions(Contest contest, string? userId, bool isUserAdmin)
        => await this.UserHasContestPermissions(
            contest.Id,
            contest.CategoryId,
            userId,
            isUserAdmin);

    public async Task<bool> UserHasContestPermissions(
        int contestId,
        int? contestCategoryId,
        string? userId,
        bool isUserAdmin)
    {
        if (!string.IsNullOrWhiteSpace(userId) && isUserAdmin)
        {
            return true;
        }

        var userIsLecturerInContest = await this.contestsData.IsUserLecturerInByContestAndUser(contestId, userId);

        if (userIsLecturerInContest)
        {
            return true;
        }

        var userIsLecturerInCategory = false;

        if (contestCategoryId.HasValue)
        {
            userIsLecturerInCategory = await this.contestCategoriesData
                .UserHasContestCategoryPermissions(contestCategoryId.Value, userId, isUserAdmin);
        }

        if (userIsLecturerInCategory)
        {
            return true;
        }

        return false;
    }

    public async Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class
    {
        var user = this.userProvider.GetCurrentUser();

        return user.IsAdmin
            ? await this.contestsData.AllTo<TServiceModel>()
            : await this.contestsData.GetAllByLecturer(user.Id)
                .MapCollection<TServiceModel>()
                .ToListAsync();
    }
}