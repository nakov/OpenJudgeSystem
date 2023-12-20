namespace OJS.Workers.SubmissionProcessors.Workers
{
    using OJS.Workers.Common;
    using OJS.Workers.SubmissionProcessors.Models;

    public class LocalSubmissionWorker
        : ISubmissionWorker
    {
        private readonly string identifier;

        public LocalSubmissionWorker(int workerNumber)
            => this.identifier = workerNumber.ToString();

        public string Location => this.identifier;

        public IExecutionResult<TResult> RunSubmission<TInput, TResult>(OjsSubmission<TInput> submission)
            where TResult : class, ISingleCodeRunResult, new()
            => new SubmissionExecutor(this.identifier).Execute<TInput, TResult>(submission);
    }
}
