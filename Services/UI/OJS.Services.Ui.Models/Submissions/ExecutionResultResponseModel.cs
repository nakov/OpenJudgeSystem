namespace OJS.Services.Ui.Models.Submissions
{
    using System;

    public class ExecutionResultResponseModel
    {
        public string Id { get; set; } = null!;

        public bool IsCompiledSuccessfully { get; set; }

        public string? CompilerComment { get; set; }

        public OutputResultResponseModel? OutputResult { get; set; }

        public TaskResultResponseModel? TaskResult { get; set; }

        public DateTime? StartedExecutionOn { get; set; }
    }
}