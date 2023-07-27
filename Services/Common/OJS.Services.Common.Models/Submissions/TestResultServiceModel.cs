using AutoMapper;
using OJS.Workers.Common;
using OJS.Workers.ExecutionStrategies.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Common.Models.Submissions
{
    public class TestResultServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public string ResultType { get; set; } = null!;

        public string ExecutionComment { get; set; } = null!;

        public string Output { get; set; } = null!;

        public CheckerDetails CheckerDetails { get; set; } = null!;

        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<TestResult, TestResultServiceModel>()
                .ForMember(
                    d => d.Output,
                    opt => opt.Ignore());
    }
}