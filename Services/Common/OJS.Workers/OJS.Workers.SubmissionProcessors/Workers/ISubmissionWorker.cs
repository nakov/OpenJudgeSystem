namespace OJS.Workers.SubmissionProcessors.Workers
{
    using OJS.Workers.Common;
    using OJS.Workers.SubmissionProcessors.Models;

    public interface ISubmissionWorker
    {
        string Location { get; }

        IExecutionResult<TResult> RunSubmission<TInput, TResult>(OjsSubmission<TInput> submission)
            where TResult : class, ISingleCodeRunResult, new();
    }
}
