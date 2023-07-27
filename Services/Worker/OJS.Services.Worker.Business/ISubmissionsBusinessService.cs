using OJS.Services.Common.Models.Submissions.ExecutionContext;

namespace OJS.Services.Worker.Business;

using OJS.Services.Worker.Models.ExecutionResult;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsBusinessService : IService
{
    ExecutionResultServiceModel ExecuteSubmission(
        SubmissionServiceModel submission);
}