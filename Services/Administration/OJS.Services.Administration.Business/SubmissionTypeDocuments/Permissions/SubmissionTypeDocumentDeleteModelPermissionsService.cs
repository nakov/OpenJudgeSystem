namespace OJS.Services.Administration.Business.SubmissionTypeDocuments.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class SubmissionTypeDocumentDeleteModelPermissionsService : IEntityPermissionsService<SubmissionTypeDocument, DeleteSubmissionTypeDocumentModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, DeleteSubmissionTypeDocumentModel value, string operation)
        => await Task.FromResult(user.IsAdminOrLecturer);
}