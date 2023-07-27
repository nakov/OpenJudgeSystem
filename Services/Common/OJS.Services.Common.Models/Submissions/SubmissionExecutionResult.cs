using OJS.Workers.SubmissionProcessors.Models;

namespace OJS.Services.Common.Models.Submissions
{
    public class SubmissionExecutionResult
    {
        public int SubmissionId { get; set; }

        public ExceptionModel? Exception { get; set; }

        public ExecutionResultServiceModel? ExecutionResult { get; set; }
    }
}