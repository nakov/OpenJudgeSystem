namespace OJS.Services.Administration.Business.Tests.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class TestIdPermissionService : IEntityPermissionsService<Test, int>
{
    private readonly ITestsDataService testsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public TestIdPermissionService(
        ITestsDataService testsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.testsDataService = testsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string action)
    {
        var contestId = await this.testsDataService
            .GetByIdQuery(value)
            .Select(x => x.Problem.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}