using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class TestResultResponseModel : IMapFrom<TestResult>
    {
        public int Id { get; set; }

        public string ResultType { get; set; } = null!;

        public string ExecutionComment { get; set; } = null!;

        public string Output { get; set; } = null!;

        public CheckerDetailsResponseModel CheckerDetails { get; set; } = null!;

        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }
    }
}