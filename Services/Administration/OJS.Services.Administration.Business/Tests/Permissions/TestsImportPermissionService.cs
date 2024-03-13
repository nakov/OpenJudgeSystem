namespace OJS.Services.Administration.Business.Tests.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Models.Tests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using System.Linq;
using System.Threading.Tasks;

public class TestsImportPermissionService : IEntityPermissionsService<Test, TestsImportRequestModel>
{
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsBusinessService contestsBusinessService;

    public TestsImportPermissionService(
        IProblemsDataService problemsDataService,
        IContestsBusinessService contestsBusinessService)
    {
        this.problemsDataService = problemsDataService;
        this.contestsBusinessService = contestsBusinessService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, TestsImportRequestModel value, string operation)
    {
        var contestId = await this.problemsDataService
            .GetByIdQuery(value.ProblemId)
            .Select(p => p.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();

        return await this.contestsBusinessService.UserHasContestPermissions(
            contestId,
            user.Id,
            user.IsAdmin);
    }
}