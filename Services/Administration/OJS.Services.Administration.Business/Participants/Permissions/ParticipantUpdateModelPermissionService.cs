namespace OJS.Services.Administration.Business.Participants.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantUpdateModelPermissionService : IEntityPermissionsService<Participant, ParticipantAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ParticipantUpdateModelPermissionService(
        IContestsBusinessService contestsBusinessService) =>
        this.contestsBusinessService = contestsBusinessService;

    public async Task<bool> HasPermission(UserInfoModel user, ParticipantAdministrationModel value, string operation) =>
        await this.contestsBusinessService.UserHasContestPermissions(
            value.ContestId,
            user.Id,
            user.IsAdmin);
}