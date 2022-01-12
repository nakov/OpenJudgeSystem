using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    public class TestRunDetailsResponseModel : IMapFrom<TestRunDetailsServiceModel>
    {
        public int Id { get; set; }

        public int TimeUsed { get; set; }

        public long MemoryUsed { get; set; }

        public int SubmissionId { get; set; }

        public string ExecutionComment { get; set; }

        public string CheckerComment { get; set; }

        public string ResultType { get; set; }

        public string? ExpectedOutputFragment { get; set; }

        public string? UserOutputFragment { get; set; }

        public bool IsTrialTest { get; set; }
    }
}