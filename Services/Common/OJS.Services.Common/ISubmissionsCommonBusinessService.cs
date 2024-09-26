namespace OJS.Services.Common;

using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubmissionsCommonBusinessService : IService
{
    SubmissionServiceModel BuildSubmissionForProcessing(
        Submission submission,
        Problem problem,
        SubmissionType submissionType);

    SubmissionServiceModel BuildSubmissionForProcessing(Submission submission);

    Task PublishSubmissionForProcessing(SubmissionServiceModel submission, SubmissionForProcessing submissionForProcessing);

    Task<int> PublishSubmissionsForProcessing(ICollection<SubmissionServiceModel> submissions);
}