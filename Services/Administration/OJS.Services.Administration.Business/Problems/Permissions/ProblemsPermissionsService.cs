namespace OJS.Services.Administration.Business.Problems.Permissions;
using OJS.Services.Administration.Models.Problems;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Business.Contests;
using System.Linq;
using System.Threading.Tasks;

public class ProblemsPermissionsService : BasePermissionService<Problem, ProblemAdministrationModel>, IProblemsPermissionsService
{
    private readonly IUserProviderService userProviderService;
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;
    public ProblemsPermissionsService(
        IUserProviderService userProviderService,
        IProblemsDataService problemsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.userProviderService = userProviderService;
        this.problemsDataService = problemsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public override bool HasDeletePermission(int id)
    {
            var currentProblem = this.problemsDataService.GetByIdQuery(id)
                .Include(x => x.ProblemGroup)
                .ThenInclude(pg => pg.Contest)
                .FirstOrDefault();
            return currentProblem != null && this.HasContestPermission(currentProblem.ProblemGroup.ContestId).GetAwaiter().GetResult();
    }

    private async Task<bool> HasContestPermission(int contestId)
    {
        var user = this.userProviderService.GetCurrentUser();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}