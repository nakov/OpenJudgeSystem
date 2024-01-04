#nullable disable
namespace OJS.Workers.ExecutionStrategies.Models
{
    using OJS.Workers.Common;

    public class OutputResult : SingleCodeRunResult
    {
        public ProcessExecutionResultType ResultType { get; set; }

        public string Output { get; set; }
    }
}