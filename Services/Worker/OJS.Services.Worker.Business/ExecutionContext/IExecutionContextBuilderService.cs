namespace OJS.Services.Worker.Business.ExecutionContext;

using SoftUni.Services.Infrastructure;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Workers.SubmissionProcessors.Models;

public interface IExecutionContextBuilderService : IService
{
    OjsSubmission<TInput> BuildOjsSubmission<TInput>(SubmissionServiceModel submissionServiceModel);

    string BuildCodeFromTemplate(SubmissionServiceModel submissionServiceModel);
}