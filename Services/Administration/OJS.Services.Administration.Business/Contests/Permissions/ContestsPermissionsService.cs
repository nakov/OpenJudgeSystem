namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Services.Administration.Models.Contests;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Common.Extensions;
using System.Security.Claims;
using System;
using System.Linq.Expressions;
using System.Linq;

public class ContestsPermissionsService : BasePermissionService<Contest, ContestAdministrationModel>, IContestPermissionsService
{
    private readonly IUserProviderService userProviderService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestsPermissionsService(
        IUserProviderService userProviderService,
        IContestsBusinessService contestsBusinessService,
        ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService)
    {
        this.userProviderService = userProviderService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public override bool HasUpdatePermission(ContestAdministrationModel model)
        => this.HasContestPermission(model.Id!.Value)
            .GetAwaiter()
            .GetResult();

    public override bool HasDeletePermission(int id)
        => this.HasContestPermission(id)
            .GetAwaiter()
            .GetResult();

    public override bool HasFullAccess(ClaimsPrincipal user)
        => user.IsAdmin();

    public override Expression<Func<Contest, bool>>? GeneratePermittedRecordsExpression() =>
        contest
            => contest.LecturersInContests.Any(l => l.LecturerId == this.userProviderService.GetCurrentUser().Id);

    private async Task<bool> HasContestPermission(int contestId)
    {
        var user = this.userProviderService.GetCurrentUser();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}