namespace OJS.Services.Busines.Submissions.Models
{
    public class OutputResultResponseModel
    {
        public int TimeUsedInMs { get; set; }

        public int MemoryUsedInBytes { get; set; }

        public string ResultType { get; set; }

        public string Output { get; set; }
    }
}