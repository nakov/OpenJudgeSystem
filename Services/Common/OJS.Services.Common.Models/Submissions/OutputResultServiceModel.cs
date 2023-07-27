namespace OJS.Services.Common.Models.Submissions
{
    public class OutputResultServiceModel
    {
        public int TimeUsedInMs { get; set; }

        public int MemoryUsedInBytes { get; set; }

        public string ResultType { get; set; } = null!;

        public string Output { get; set; } = null!;
    }
}