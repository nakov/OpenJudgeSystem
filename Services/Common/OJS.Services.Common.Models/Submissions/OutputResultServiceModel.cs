namespace OJS.Services.Common.Models.Submissions
{
    public class OutputResultServiceModel
    {
        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }

        public string ResultType { get; set; } = null!;

        public string Output { get; set; } = null!;
    }
}