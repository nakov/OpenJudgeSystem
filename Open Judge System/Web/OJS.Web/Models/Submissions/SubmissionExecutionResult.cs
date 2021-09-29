namespace OJS.Web.Models.Submissions
{
    public class SubmissionExecutionResult
    {
        public int SubmissionId { get; set; }

        public ExceptionModel Exception { get; set; }

        public ExecutionResultResponseModel ExecutionResult { get; set; }
    }
}