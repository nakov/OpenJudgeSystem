namespace OJS.Data.Models.Submissions
{
    using SoftUni.Data.Infrastructure.Models;

    public class SubmissionForProcessing : Entity<int>
    {
        public int SubmissionId { get; set; }

        public bool Processing { get; set; }

        public bool Processed { get; set; }
    }
}