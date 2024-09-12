namespace OJS.Data.Models.Submissions
{
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Common;
    using System;

    public class SubmissionForProcessing : AuditInfoEntity<int>
    {
        public int SubmissionId { get; set; }

        public SubmissionProcessingState State { get; set; }

        public DateTimeOffset? EnqueuedAt { get; set; }

        public DateTimeOffset? ProcessingStartedAt { get; set; }

        public DateTimeOffset? ProcessedAt { get; set; }
    }
}