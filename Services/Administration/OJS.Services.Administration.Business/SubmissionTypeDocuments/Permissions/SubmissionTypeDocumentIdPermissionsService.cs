namespace OJS.Services.Administration.Business.SubmissionTypeDocuments.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

/// <inheritdoc />
public class SubmissionTypeDocumentIdPermissionsService : IEntityPermissionsService<SubmissionTypeDocument, int>
{
    public async Task<bool> HasPermission(UserInfoModel user, int value, string operation)
        => await Task.FromResult(user.IsAdminOrLecturer);
}