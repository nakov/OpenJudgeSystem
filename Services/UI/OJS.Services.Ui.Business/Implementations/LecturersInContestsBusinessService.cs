namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Ui.Data;

public class LecturersInContestsBusinessService : ILecturersInContestsBusinessService
{
    private readonly IParticipantsDataService participantsDataService;
    private readonly IContestsDataService contestsDataService;
    private readonly IUserProviderService userProviderService;

    public LecturersInContestsBusinessService(
        IParticipantsDataService participantsDataService,
        IContestsDataService contestsDataService,
        IUserProviderService userProviderService)
    {
        this.participantsDataService = participantsDataService;
        this.contestsDataService = contestsDataService;
        this.userProviderService = userProviderService;
        this.participantsDataService.DisableLazyLoading();
    }

    public bool IsUserAdminOrLecturerInContest(Contest contest)
    {
        var isAdmin = this.userProviderService.GetCurrentUser().IsAdmin;

        var isUserLecturerInContest = this.IsUserLecturerInContest(contest);

        return isAdmin || isUserLecturerInContest;
    }

    public bool IsUserLecturerInContest(Contest contest)
    {
        var currentUser = this.userProviderService.GetCurrentUser();

        return contest.LecturersInContests.Any(c => c.LecturerId == currentUser.Id) ||
               contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == currentUser.Id);
    }
}