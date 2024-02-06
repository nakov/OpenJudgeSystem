namespace OJS.Services.Administration.Business.SubmissionsForProcessing.Permissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionsForProcessing;

public class SubmissionsForProcessingPermissionsService : BasePermissionService<
    SubmissionForProcessing,
    SubmissionsForProcessingAdministrationServiceModel>,
    ISubmissionsForProcessingPermissionsService
{
}