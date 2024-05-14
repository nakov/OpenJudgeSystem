namespace OJS.Services.Administration.Business.Problems.Permissions;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class CopyPermissionService : IEntityPermissionsService<Problem, CopyProblemRequestModel>
{
        private readonly IContestsBusinessService contestsBusinessService;

        public CopyPermissionService(IContestsBusinessService contestsBusinessService)
            => this.contestsBusinessService = contestsBusinessService;

        public async Task<bool> HasPermission(UserInfoModel user, CopyProblemRequestModel value, string action)
        {
            var hasDestinationContestPermissions = await this.contestsBusinessService
                .UserHasContestPermissions(value.DestinationContestId, user.Id, user.IsAdmin);

            return hasDestinationContestPermissions;
        }
}