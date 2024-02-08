namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.SubmissionsForProcessing.Permissions;
using OJS.Services.Administration.Business.SubmissionsForProcessing.Validation;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Common.Data.Pagination;

public class SubmissionsForProcessingController : BaseAdminApiController<
    SubmissionForProcessing,
    SubmissionsForProcessingAdministrationServiceModel,
    SubmissionsForProcessingAdministrationServiceModel>
{
    public SubmissionsForProcessingController(
        IGridDataService<SubmissionForProcessing> submissionsGridDataService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService,
        SubmissionsForProcessingAdministrationModelValidator validator,
        SubmissionsForProcessingDeleteValidator submissionsForProcessingDeleteValidator,
        ISubmissionsForProcessingPermissionsService submissionsPermissionsService)
        : base(
            submissionsGridDataService,
            submissionsForProcessingBusinessService,
            validator,
            submissionsForProcessingDeleteValidator,
            submissionsPermissionsService)
    {
    }
}