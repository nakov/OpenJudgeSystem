namespace OJS.Services.Worker.Business.ExecutionContext;

using OJS.Services.Worker.Models.ExecutionContext;
using OJS.Workers.SubmissionProcessors.Models;
using SoftUni.Services.Infrastructure;

public interface IExecutionContextBuilderService : IService
{
    OjsSubmission<TInput> BuildOjsSubmission<TInput>(SubmissionServiceModel submissionServiceModel);

    string BuildCodeFromTemplate(SubmissionServiceModel submissionServiceModel);
}