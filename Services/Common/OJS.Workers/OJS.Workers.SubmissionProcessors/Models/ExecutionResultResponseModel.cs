#nullable disable
namespace OJS.Workers.SubmissionProcessors.Models
{
    using System;

    public class ExecutionResultResponseModel
    {
        public string Id { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; }

        public OutputResultResponseModel OutputResult { get; set; }

        public TaskResultResponseModel TaskResult { get; set; }

        public DateTime? StartedExecutionOn { get; set; }

        public DateTime? CompletedExecutionOn { get; set; }
    }
}