namespace OJS.Services.Common;

using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubmissionsCommonBusinessService : IService
{
    SubmissionServiceModel BuildSubmissionForProcessing(Submission newSubmission,
        Problem problem,
        SubmissionType submissionType);

    SubmissionServiceModel BuildSubmissionForProcessing(Submission existingSubmission);

    Task PublishSubmissionForProcessing(SubmissionServiceModel submission);

    Task PublishSubmissionsForProcessing(IEnumerable<SubmissionServiceModel> submissions);
}