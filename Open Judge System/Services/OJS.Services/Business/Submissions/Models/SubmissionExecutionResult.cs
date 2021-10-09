namespace OJS.Services.Busines.Submissions.Models
{
    public class SubmissionExecutionResult
    {
        public int SubmissionId { get; set; }

        public ExceptionModel Exception { get; set; }

        public ExecutionResultResponseModel ExecutionResult { get; set; }
    }
}