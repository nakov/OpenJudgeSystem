namespace OJS.Services.Administration.Business.ExamGroups.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Exceptions;
using System.Threading.Tasks;

public class MultipleUsersToExamGroupPermissionService : IEntityPermissionsService<ExamGroup, MultipleUsersToExamGroupModel>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IExamGroupsDataService examGroupsDataService;

    public MultipleUsersToExamGroupPermissionService(IContestsBusinessService contestsBusinessService, IExamGroupsDataService examGroupsDataService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.examGroupsDataService = examGroupsDataService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, MultipleUsersToExamGroupModel value, string operation)
    {
        var contestId = await this.examGroupsDataService.GetContestIdById(value.ExamGroupId);
        if (!contestId.HasValue)
        {
            throw new BusinessServiceException("Unable to add or remove user from exam group which has no contest.");
        }

        return await this.contestsBusinessService.UserHasContestPermissions(contestId.Value!, user.Id, user.IsAdmin);
    }
}