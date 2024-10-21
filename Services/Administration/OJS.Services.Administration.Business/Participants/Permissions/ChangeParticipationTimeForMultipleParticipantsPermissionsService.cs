namespace OJS.Services.Administration.Business.Participants.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ChangeParticipationTimeForMultipleParticipantsPermissionsService : IEntityPermissionsService<Contest, ChangeParticipationTimeForMultipleParticipantsModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ChangeParticipationTimeForMultipleParticipantsPermissionsService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public Task<bool> HasPermission(UserInfoModel user, ChangeParticipationTimeForMultipleParticipantsModel value, string operation)
        => this.contestsBusinessService.UserHasContestPermissions(value.ContestId, user.Id, user.IsAdmin);
}