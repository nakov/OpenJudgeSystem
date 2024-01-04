namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Common;
using OJS.Services.Ui.Data;

public class LecturersInContestsBusinessService : ILecturersInContestsBusinessService
{
    private readonly IContestsDataService contestsDataService;
    private readonly IUserProviderService userProviderService;

    public LecturersInContestsBusinessService(
        IContestsDataService contestsDataService,
        IUserProviderService userProviderService)
    {
        this.contestsDataService = contestsDataService;
        this.userProviderService = userProviderService;
    }

    public async Task<bool> IsCurrentUserAdminOrLecturerInContest(int? contestId)
    {
        if (contestId == null)
        {
            return false;
        }

        var currentUser = this.userProviderService.GetCurrentUser();

        return currentUser.IsAdmin ||
               await this.contestsDataService.IsUserLecturerInByContestAndUser(contestId.Value, currentUser.Id);
    }
}