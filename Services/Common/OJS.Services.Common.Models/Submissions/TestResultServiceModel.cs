namespace OJS.Services.Common.Models.Submissions
{
    using AutoMapper;
    using OJS.Data.Models.Tests;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Services.Infrastructure.Models.Mapping;
    using System;

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
        {
            configuration
                .CreateMap<TestResult, TestResultServiceModel>()
                .ForMember(
                    d => d.CheckerDetails,
                    opt =>
                        opt.MapFrom(s => s.CheckerDetails))
                .ForMember(
                    d => d.Output,
                    opt =>
                        opt.MapFrom(s => s.CheckerDetails.UserOutputFragment));

            configuration.CreateMap<TestResultServiceModel, TestRun>()
                .ForMember(
                    d => d.CheckerComment,
                    opt => opt.MapFrom(s => s.CheckerDetails.Comment))
                .ForMember(
                    d => d.ExpectedOutputFragment,
                    opt => opt.MapFrom(s => s.CheckerDetails.ExpectedOutputFragment))
                .ForMember(
                    d => d.UserOutputFragment,
                    opt => opt.MapFrom(s => s.CheckerDetails.UserOutputFragment))
                .ForMember(
                    d => d.ResultType,
                    opt => opt.MapFrom(s => (TestRunResultType)Enum.Parse(typeof(TestRunResultType), s.ResultType)))
                .ForMember(
                    d => d.TestId,
                    opt => opt.MapFrom(s => s.Id))
                .ForMember(
                    d => d.TimeUsed,
                    opt => opt.MapFrom(s => s.TimeUsed))
                .ForMember(
                    d => d.MemoryUsed,
                    opt => opt.MapFrom(s => s.MemoryUsed))
                .ForMember(d => d.ExecutionComment, opt => opt.MapFrom(s => s.ExecutionComment))
                .ForMember(m => m.SubmissionId, opt => opt.Ignore())
                .ForMember(m => m.Submission, opt => opt.Ignore())
                .ForMember(m => m.Test, opt => opt.Ignore());
        }
    }
}