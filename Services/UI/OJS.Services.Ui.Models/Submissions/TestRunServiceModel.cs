using AutoMapper;
using OJS.Data.Models.Tests;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class TestRunServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public int TimeUsed { get; set; }

        public long MemoryUsed { get; set; }

        public int SubmissionId { get; set; }

        public string ExecutionComment { get; set; }

        public string CheckerComment { get; set; }

        public string ResultType { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<TestRun, TestRunServiceModel>()
                .ForMember(d => d.ResultType, opt => opt.MapFrom(s => s.ResultType.ToString()));
    }
}