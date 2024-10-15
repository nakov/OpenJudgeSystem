namespace OJS.Services.Administration.Business.Participants.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ChangeParticipationTimeForSingleParticipantPermissionsService : IEntityPermissionsService<Contest, ChangeParticipationTimeForSingleParticipantModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ChangeParticipationTimeForSingleParticipantPermissionsService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public Task<bool> HasPermission(UserInfoModel user, ChangeParticipationTimeForSingleParticipantModel value, string operation)
        => this.contestsBusinessService.UserHasContestPermissions(value.ContestId, user.Id, user.IsAdmin);
}