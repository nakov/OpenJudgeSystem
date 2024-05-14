namespace OJS.Services.Administration.Business.ExamGroups.Permissions;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Exceptions;
using System.Threading.Tasks;

public class ExamGroupIdPermissionsService : IEntityPermissionsService<ExamGroup, int>
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IExamGroupsDataService examGroupsDataService;

    public ExamGroupIdPermissionsService(IContestsBusinessService contestsBusinessService, IExamGroupsDataService examGroupsDataService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.examGroupsDataService = examGroupsDataService;
    }

    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(value).FirstOrDefaultAsync();
        if (examGroup == null)
        {
            throw new BusinessServiceException("Exam group not found.");
        }

        if (examGroup.ContestId == null)
        {
            return user.IsAdmin;
        }

        return await this.contestsBusinessService.UserHasContestPermissions(
            (int)examGroup.ContestId,
            user.Id,
            user.IsAdmin);
    }
}