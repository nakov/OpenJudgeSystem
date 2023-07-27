namespace OJS.PubSub.Worker.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Workers.Common.Models;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;

public class SubmissionForProcessingPubSubModel : IMapExplicitly
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

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<SubmissionForProcessingPubSubModel, SubmissionServiceModel>()
            .ForMember(
                d => d.ExecutionOptions,
                opt => opt.Ignore())
            .ReverseMap();

        configuration.CreateMap<Submission, SubmissionForProcessingPubSubModel>()
            .ForMember(
                d => d.ExecutionType,
                // Hardcoding this for now as its the only one currently used in the system
                opt => opt.MapFrom(s => ExecutionType.TestsExecution))
            .ForMember(
                d => d.ExecutionStrategy,
                opt => opt.MapFrom(s => s.SubmissionType!.ExecutionStrategyType))
            .ForMember(
                d => d.Code,
                opt => opt.MapFrom(s => s.ContentAsString))
            .ForMember(
                d => d.FileContent,
                opt => opt.MapFrom(s => s.IsBinaryFile ? s.Content : null));
    }
}