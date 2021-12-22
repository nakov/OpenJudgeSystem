namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Administration.Data;
using System.Threading.Tasks;

public class ContestsBusinessService : IContestsBusinessService
{
    private readonly IContestsDataService contestsData;

    public ContestsBusinessService(IContestsDataService contestsData)
        => this.contestsData = contestsData;

    public async Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin)
        => !string.IsNullOrWhiteSpace(userId) &&
           (isUserAdmin || await this.contestsData.IsUserLecturerInByContestAndUser(contestId, userId));
}