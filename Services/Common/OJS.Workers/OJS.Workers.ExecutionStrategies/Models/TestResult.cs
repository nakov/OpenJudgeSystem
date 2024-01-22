#nullable disable
namespace OJS.Workers.ExecutionStrategies.Models
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;

    public class TestResult : SingleCodeRunResult
    {
        public int Id { get; set; }

        public string Input { get; set; }

        public TestRunResultType ResultType { get; set; }

        public CheckerDetails CheckerDetails { get; set; } = new();

        public bool IsTrialTest { get; set; }

        public string ExecutionComment { get; set; }
    }
}