namespace OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;

using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Services.Infrastructure.Models.Mapping;

public class SimpleExecutionDetailsRequestModel : IMapTo<SimpleExecutionDetailsServiceModel>
{
    public string? Input { get; set; }

    public byte[]? TaskSkeleton { get; set; }

    public string? TaskSkeletonAsString { get; set; }
}