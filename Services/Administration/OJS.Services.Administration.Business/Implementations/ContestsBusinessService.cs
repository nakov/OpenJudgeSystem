namespace OJS.Services.Administration.Business.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ContestsBusinessService : IContestsBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly IUserProviderService userProvider;

    public ContestsBusinessService(
        IContestsDataService contestsData,
        IUserProviderService userProvider)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
    }

    public async Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin)
        => !string.IsNullOrWhiteSpace(userId) &&
           (isUserAdmin || await this.contestsData.IsUserLecturerInByContestAndUser(contestId, userId));

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