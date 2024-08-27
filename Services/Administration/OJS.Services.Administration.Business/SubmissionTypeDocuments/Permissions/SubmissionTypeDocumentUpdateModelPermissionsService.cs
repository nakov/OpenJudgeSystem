namespace OJS.Services.Administration.Business.SubmissionTypeDocuments.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

/// <inheritdoc />
public class SubmissionTypeDocumentUpdateModelPermissionsService : IEntityPermissionsService<SubmissionTypeDocument, SubmissionTypeDocumentAdministrationModel>
{
    public async Task<bool> HasPermission(UserInfoModel user, SubmissionTypeDocumentAdministrationModel value, string operation)
        => await Task.FromResult(user.IsAdminOrLecturer);
}