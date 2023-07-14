namespace OJS.Services.Ui.Models.Submissions
{
    public class OutputResultResponseModel
    {
        public int TimeUsedInMs { get; set; }

        public int MemoryUsedInBytes { get; set; }

        public string ResultType { get; set; } = null!;

        public string Output { get; set; } = null!;
    }
}