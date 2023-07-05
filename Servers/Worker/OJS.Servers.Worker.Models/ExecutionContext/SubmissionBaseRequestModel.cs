namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentExtensions.Extensions;
    using OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;
    using OJS.Services.Worker.Models.ExecutionContext;
    using OJS.Services.Worker.Models.ExecutionContext.Mapping;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public abstract class SubmissionBaseRequestModel<TSubmissionRequestModel, TExecutionDetails>
        : IMapTo<SubmissionServiceModel>,
        IMapExplicitly
        where TSubmissionRequestModel : SubmissionBaseRequestModel<TSubmissionRequestModel, TExecutionDetails>
    {
        [Required]
        public string? ExecutionType { get; set; }

        [Required]
        public string? ExecutionStrategy { get; set; }

        [Required]
        public TExecutionDetails ExecutionDetails { get; set; } = default!;

        public ExecutionOptionsRequestModel ExecutionOptions { get; set; } = new ExecutionOptionsRequestModel();

        public int TimeLimit { get; set; }

        public int MemoryLimit { get; set; }

        public byte[]? FileContent { get; set; }

        public bool WithExceptionStackTrace { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
        {
            var mapping = configuration
                .CreateMap<TSubmissionRequestModel, SubmissionServiceModel>()
                .ForMember(
                    m => m.ExecutionType,
                    opt => opt.MapFrom<ExecutionTypeMemberValueResolver, string>(src =>
                        src.ExecutionType!))
                .ForMember(
                    m => m.ExecutionStrategyType,
                    opt => opt.MapFrom<ExecutionStrategyMemberValueResolver, string>(src =>
                        src.ExecutionStrategy!))
                .ForMember(
                    m => m.SimpleExecutionDetails,
                    opt => opt.MapFrom(src =>
                        (src.ExecutionDetails!.ToString() ?? string.Empty).FromJson<SimpleExecutionDetailsRequestModel>()))
                .ForMember(
                    m => m.TestsExecutionDetails,
                    opt => opt.MapFrom(src =>
                        (src.ExecutionDetails!.ToString() ?? string.Empty).FromJson<TestsExecutionDetailsRequestModel>()));

            this.MapAdditionalMembers(mapping);
        }

        protected virtual void MapAdditionalMembers(
            IMappingExpression<TSubmissionRequestModel, SubmissionServiceModel> mapping)
        {
        }
    }
}