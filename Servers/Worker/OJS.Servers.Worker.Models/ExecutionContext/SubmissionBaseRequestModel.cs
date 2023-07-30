using OJS.Services.Common.Models.Submissions.ExecutionContext;

namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using FluentExtensions.Extensions;
    using OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public abstract class SubmissionBaseRequestModel<TSubmissionRequestModel, TExecutionDetails>
        : IMapExplicitly
        where TSubmissionRequestModel : SubmissionBaseRequestModel<TSubmissionRequestModel, TExecutionDetails>
    {
        public int Id { get; set; }

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
                    m => m.ExecutionStrategy,
                    opt => opt.MapFrom(src => src.ExecutionStrategy))
                .ForMember(
                    m => m.SimpleExecutionDetails,
                    opt => opt.MapFrom(src =>
                        (src.ExecutionDetails!.ToString() ?? string.Empty)
                        .FromJson<SimpleExecutionDetailsRequestModel>()))
                .ForMember(
                    m => m.TestsExecutionDetails,
                    opt => opt.MapFrom(src =>
                        (src.ExecutionDetails!.ToString() ?? string.Empty)
                        .FromJson<TestsExecutionDetailsRequestModel>()))
                .ForMember(
                    m => m.ExecutionOptions,
                    opt => opt.Ignore());

            this.MapAdditionalMembers(mapping);
        }

        protected virtual void MapAdditionalMembers(
            IMappingExpression<TSubmissionRequestModel, SubmissionServiceModel> mapping)
        {
        }
    }
}