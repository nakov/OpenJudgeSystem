namespace OJS.Services.Common.Models.Submissions
{
    using AutoMapper;
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class TestResultServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public string ResultType { get; set; } = string.Empty;

        public string ExecutionComment { get; set; } = string.Empty;

        public string Output { get; set; } = string.Empty;

        public CheckerDetails CheckerDetails { get; set; } = new();

        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }

        public bool IsTrialTest { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<TestResult, TestResultServiceModel>()
                .ForMember(
                    d => d.CheckerDetails,
                    opt =>
                        opt.MapFrom(s => s.CheckerDetails))
                .ForMember(
                    d => d.Output,
                    opt =>
                        opt.MapFrom(s => s.CheckerDetails.UserOutputFragment))
                .ReverseMap();
    }
}