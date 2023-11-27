namespace OJS.Services.Worker.Business;

using OJS.Common.Contracts;
using OJS.Workers.Common.Models;

using OJS.Services.Common.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsBusinessService : IService
{
    ExecutionResultServiceModel ExecuteSubmission(SubmissionServiceModel submission);

    IPlagiarismDetector GetPlagiarismDetector(PlagiarismDetectorType plagiarismDetectorType);
}