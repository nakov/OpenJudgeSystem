namespace OJS.Services.Worker.Business
{
    using OJS.Workers.Common;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionExecutor : IService
    {
        IExecutionResult<TResult> Execute<TInput, TResult>(OjsSubmission<TInput> submission)
            where TResult : ISingleCodeRunResult, new();
    }
}