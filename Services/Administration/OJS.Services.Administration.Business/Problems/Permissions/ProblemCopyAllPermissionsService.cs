namespace OJS.Services.Administration.Business.Problems.Permissions;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

/// <inheritdoc />
public class ProblemCopyAllPermissionsService : IEntityPermissionsService<Problem, CopyAllToContestViewModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemCopyAllPermissionsService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public async Task<bool> HasPermission(UserInfoModel user, CopyAllToContestViewModel value, string action)
    {
        var hasSourceContestPermissions = await this.contestsBusinessService
            .UserHasContestPermissions(value.SourceContestId, user.Id, user.IsAdmin);

        var hasDestinationContestPermissions = await this.contestsBusinessService
            .UserHasContestPermissions(value.DestinationContestId, user.Id, user.IsAdmin);

        return hasSourceContestPermissions && hasDestinationContestPermissions;
    }
}