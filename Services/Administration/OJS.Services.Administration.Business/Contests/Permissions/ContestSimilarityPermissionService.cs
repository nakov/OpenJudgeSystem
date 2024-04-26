namespace OJS.Services.Administration.Business.Contests.Permissions;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class ContestSimilarityPermissionService : IEntityPermissionsService<Contest, SimillarityCheckModel>
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestSimilarityPermissionService(IContestsBusinessService contestsBusinessService) => this.contestsBusinessService = contestsBusinessService;

    public async Task<bool> HasPermission(UserInfoModel user, SimillarityCheckModel model, string operation)
    {
        foreach (var id in model.ContestIds!)
        {
           var hasPermissionForContest = await this.contestsBusinessService.UserHasContestPermissions(id, user.Id, user.IsAdmin);
           if (!hasPermissionForContest)
           {
               return false;
           }
        }

        return true;
    }
}