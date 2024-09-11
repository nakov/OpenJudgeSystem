namespace OJS.Data.Models.Submissions
{
    using OJS.Data.Models.Common;
    using System;

    public class SubmissionForProcessing : AuditInfoEntity<int>
    {
        public int SubmissionId { get; set; }

        public bool Enqueued { get; set; }

        public bool Processing { get; set; }

        public bool Processed { get; set; }

        public DateTimeOffset? EnqueuedAt { get; set; }

        public DateTimeOffset? ProcessingStartedAt { get; set; }

        public DateTimeOffset? ProcessedAt { get; set; }
    }
}