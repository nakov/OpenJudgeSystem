namespace OJS.Data.Models.Submissions
{
    using OJS.Data.Models.Common;

    public class SubmissionForProcessing : AuditInfoEntity<int>
    {
        public int SubmissionId { get; set; }

        public bool Processing { get; set; }

        public bool Processed { get; set; }

        public string? SerializedExecutionDetails { get; set; }

        public string? SerializedExecutionResult { get; set; }

        public string? SerializedException { get; set; }
    }
}