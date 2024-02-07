namespace OJS.Services.Administration.Business.Contests;

using System.Threading.Tasks;
using OJS.Services.Administration.Business.Contests.Interfaces;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestPermissionsService(
    IContestsBusinessService contestsBusinessService)
    : PermissionsService<ContestAdministrationModel, int>, IContestPermissionsService
{
    public override async Task<UserPermissionsModel> GetPermissions(UserInfoModel user, int id)
        => (await base.GetPermissions(user, id))
            .WithFullAccess(allow: await contestsBusinessService
                .UserHasContestPermissions(id, user.Id, user.IsAdmin));
}