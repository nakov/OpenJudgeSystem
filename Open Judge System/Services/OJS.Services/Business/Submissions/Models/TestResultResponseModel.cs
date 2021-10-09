namespace OJS.Services.Busines.Submissions.Models
{
    public class TestResultResponseModel
    {
        public int Id { get; set; }

        public string ResultType { get; set; }

        public string ExecutionComment { get; set; }

        public string Output { get; set; }

        public CheckerDetailsResponseModel CheckerDetails { get; set; }

        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }
    }
}