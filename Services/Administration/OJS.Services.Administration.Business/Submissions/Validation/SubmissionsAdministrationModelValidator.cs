namespace OJS.Services.Administration.Business.Submissions.Validation;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Data.Validation;

public class SubmissionsAdministrationModelValidator : BaseAdministrationModelValidator<SubmissionAdministrationServiceModel, int, Submission>
{
    public SubmissionsAdministrationModelValidator(ISubmissionsDataService submissionsDataService)
        : base(submissionsDataService)
    {
    }
}