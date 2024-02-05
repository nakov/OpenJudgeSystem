namespace OJS.Services.Administration.Business.Submissions.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.Submissions;

public class SubmissionsPermissionsService : BasePermissionService<
    Submission,
    SubmissionAdministrationServiceModel>,
    ISubmissionsPermissionsService
{
}