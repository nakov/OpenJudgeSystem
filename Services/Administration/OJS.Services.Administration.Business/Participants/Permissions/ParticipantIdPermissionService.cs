namespace OJS.Services.Administration.Business.Participants.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantIdPermissionService : IEntityPermissionsService<Participant, int>
{
    private readonly IParticipantsDataService participantsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ParticipantIdPermissionService(
        IParticipantsDataService participantsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.participantsDataService = participantsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation)
    {
        var contestId = await this.participantsDataService.GetByIdQuery(value)
            .Select(x => x.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}