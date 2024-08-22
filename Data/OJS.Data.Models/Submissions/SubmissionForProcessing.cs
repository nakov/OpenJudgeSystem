namespace OJS.Data.Models.Submissions
{
    using OJS.Data.Models.Common;

    public class SubmissionForProcessing : AuditInfoEntity<int>
    {
        public int SubmissionId { get; set; }

        public bool Processing { get; set; }

        public bool Processed { get; set; }
    }
}