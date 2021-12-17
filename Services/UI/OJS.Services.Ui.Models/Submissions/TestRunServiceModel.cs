using OJS.Data.Models.Tests;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class TestRunServiceModel : IMapFrom<TestRun>
    {
        public int Id { get; set; }

        public int TimeUsed { get; set; }

        public long MemoryUsed { get; set; }

        public int SubmissionId { get; set; }

        public string ExecutionComment { get; set; }

        public string CheckerComment { get; set; }
    }
}