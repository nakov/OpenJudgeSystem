namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Services.Administration.Models.Contests;
using System.Threading.Tasks;

public class ContestsPermissionsService : BasePermissionService<ContestAdministrationModel>, IContestPermissionsService
{
    private readonly IUserProviderService userProviderService;
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestsPermissionsService(
        IUserProviderService userProviderService,
        IContestsBusinessService contestsBusinessService)
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

    private async Task<bool> HasContestPermission(int contestId)
    {
        var user = this.userProviderService.GetCurrentUser();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}