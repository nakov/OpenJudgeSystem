using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Common.Models;
using OJS.Workers.ExecutionStrategies.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.PubSub.Worker.Models.Submissions;

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
                d => d.Code,
                opt => opt.MapFrom(s => s.IsBinaryFile ? string.Empty : s.ContentAsString))
            .ForMember(
                d => d.FileContent,
                opt => opt.MapFrom(s => s.IsBinaryFile ? s.Content : null))
            .ForMember(
                d => d.ExecutionStrategy,
                opt => opt.MapFrom(s => s.SubmissionType!.ExecutionStrategyType))
            .ForMember(
                d => d.ExecutionType,
                opt => opt.MapFrom(s => ExecutionType.TestsExecution))
            .ForMember(
                d => d.TimeLimit,
                opt => opt.MapFrom(s => s.Problem!.TimeLimit))
            .ForMember(
                d => d.MemoryLimit,
                opt => opt.MapFrom(s => s.Problem!.MemoryLimit))
            .ForMember(
                d => d.TestsExecutionDetails,
                opt => opt.MapFrom(s => s.Problem))
            .ForMember(
                d => d.SimpleExecutionDetails,
                opt => opt.Ignore());
    }
}