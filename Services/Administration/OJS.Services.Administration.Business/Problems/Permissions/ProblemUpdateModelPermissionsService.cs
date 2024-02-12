namespace OJS.Services.Administration.Business.Problems.Permissions;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

/// <inheritdoc />
public class ProblemUpdateModelPermissionsService : IEntityPermissionsService<Problem, ProblemAdministrationModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ProblemUpdateModelPermissionsService(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    public Task<bool> HasPermission(UserInfoModel user, ProblemAdministrationModel model, string action)
        => this.contestsBusinessService
            .UserHasContestPermissions(model.ContestId, user.Id, user.IsAdmin);
}