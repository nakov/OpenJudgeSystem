namespace OJS.Services.Administration.Business.SubmissionTypes.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SubmissionTypesUpdateModelPermissionService : IEntityPermissionsService<SubmissionType, SubmissionTypesAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, SubmissionTypesAdministrationModel model, string action)
        => await Task.FromResult(user.IsAdmin);
}