namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.SubmissionsForProcessing;
using OJS.Services.Administration.Business.SubmissionsForProcessing.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Common.Data;

public class SubmissionsForProcessingController : BaseAdminApiController<
    SubmissionForProcessing,
    int,
    SubmissionsForProcessingAdministrationServiceModel,
    SubmissionsForProcessingAdministrationServiceModel>
{
    public SubmissionsForProcessingController(
        IGridDataService<SubmissionForProcessing> submissionsGridDataService,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService,
        SubmissionsForProcessingAdministrationModelValidator validator,
        IDataService<AccessLog> accessLogsData)
        : base(
            submissionsGridDataService,
            submissionsForProcessingBusinessService,
            validator,
            accessLogsData)
    {
    }
}