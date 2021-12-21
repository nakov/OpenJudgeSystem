namespace OJS.Data.Models.Tests
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Submissions;
    using SoftUni.Judge.Common.Enumerations;

    public class TestRun : Entity<int>
    {
        public int SubmissionId { get; set; }

        public virtual Submission Submission { get; set; } = new();

        public int TestId { get; set; }

        public virtual Test Test { get; set; } = new();

        public int TimeUsed { get; set; }

        public long MemoryUsed { get; set; }

        public TestRunResultType ResultType { get; set; }

        public string? ExecutionComment { get; set; }

        public string? CheckerComment { get; set; }

        public string? ExpectedOutputFragment { get; set; }

        public string? UserOutputFragment { get; set; }
    }
}