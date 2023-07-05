namespace OJS.Services.Ui.Models.Submissions
{
    public class ExecutionResultResponseModel
    {
        public string Id { get; set; } = null!;

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; } = null!;

        public OutputResultResponseModel? OutputResult { get; set; }

        public TaskResultResponseModel TaskResult { get; set; } = null!;
    }
}