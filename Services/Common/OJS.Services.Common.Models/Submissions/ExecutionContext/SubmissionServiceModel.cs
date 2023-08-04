namespace OJS.Services.Common.Models.Submissions.ExecutionContext
{
    using System;
    using AutoMapper;
    using OJS.Services.Common.Models.Submissions.ExecutionContext.Mapping;
    using OJS.Services.Common.Models.Submissions.ExecutionDetails;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Models;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SubmissionServiceModel : IMapExplicitly
    {
        public int Id { get; set; }
        public ExecutionType ExecutionType { get; set; }

        public ExecutionStrategyType ExecutionStrategy { get; set; }

        public byte[]? FileContent { get; set; }

        public string? Code { get; set; }

        public int TimeLimit { get; set; }

        public int MemoryLimit { get; set; }

        public DateTime? StartedExecutionOn { get; set; }

        public SimpleExecutionDetailsServiceModel? SimpleExecutionDetails { get; set; }

        public TestsExecutionDetailsServiceModel? TestsExecutionDetails { get; set; }

        public ExecutionOptionsServiceModel ExecutionOptions { get; set; } = new ();

        public void RegisterMappings(IProfileExpression configuration) =>
            configuration
                .CreateMap(typeof(SubmissionServiceModel), typeof(OjsSubmission<>))
                .ForMember(
                    nameof(OjsSubmission<object>.Input),
                    opt => opt.MapFrom(typeof(SubmissionInputValueResolver)))
                .ForMember(
                    nameof(OjsSubmission<object>.ExecutionStrategyType),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.ExecutionStrategy)))
                .ForMember(
                    nameof(OjsSubmission<object>.ExecutionType),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.ExecutionType)))
                .ForMember(
                    nameof(OjsSubmission<object>.Code),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.Code)))
                .ForMember(
                    nameof(OjsSubmission<object>.FileContent),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.FileContent)))
                .ForMember(
                    nameof(OjsSubmission<object>.MemoryLimit),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.MemoryLimit)))
                .ForMember(
                    nameof(OjsSubmission<object>.TimeLimit),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.TimeLimit)))
                .ForMember(
                    nameof(OjsSubmission<object>.StartedExecutionOn),
                    opt => opt.MapFrom(nameof(SubmissionServiceModel.StartedExecutionOn)))
                .ForAllOtherMembers(opt => opt.Ignore());
    }
}
