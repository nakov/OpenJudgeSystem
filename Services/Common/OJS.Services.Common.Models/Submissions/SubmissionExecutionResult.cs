namespace OJS.Services.Common.Models.Submissions
{
    using OJS.Workers.SubmissionProcessors.Models;

    public class SubmissionExecutionResult
    {
        public int SubmissionId { get; set; }

        public ExceptionModel? Exception { get; set; }

        public ExecutionResultServiceModel? ExecutionResult { get; set; }
    }
}