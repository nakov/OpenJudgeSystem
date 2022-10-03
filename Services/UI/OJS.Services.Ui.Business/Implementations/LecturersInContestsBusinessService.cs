using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Services.Common;
using OJS.Services.Ui.Data;
using System.Linq;

namespace OJS.Services.Ui.Business.Implementations;

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
    }

    public bool IsUserAdminOrLecturerInContest(Contest contest)
    {
        var currentUser = userProviderService.GetCurrentUser();

        return userProviderService.GetCurrentUser().IsAdmin ||
            contest.LecturersInContests.Any(c => c.LecturerId == currentUser.Id) ||
            contest.Category.LecturersInContestCategories.Any(cl => cl.LecturerId == currentUser.Id);
    }

}