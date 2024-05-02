namespace OJS.Services.Worker.Business.ExecutionContext;

using OJS.Services.Infrastructure;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Workers.Common;

public interface IExecutionContextBuilderService : IService
{
    OjsSubmission<TInput> BuildOjsSubmission<TInput>(SubmissionServiceModel submissionServiceModel);

    string BuildCodeFromTemplate(SubmissionServiceModel submissionServiceModel);
}