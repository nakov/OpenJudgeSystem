namespace OJS.PubSub.Worker.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Common.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

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
        => configuration
            .CreateMap<SubmissionForProcessingPubSubModel, SubmissionServiceModel>()
            .ForMember(
                d => d.ExecutionOptions,
                opt => opt.Ignore())
            .ReverseMap();
}