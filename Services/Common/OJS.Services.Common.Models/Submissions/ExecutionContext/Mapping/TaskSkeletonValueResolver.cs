using AutoMapper;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Common.Extensions;
using OJS.Workers.ExecutionStrategies.Models;

namespace OJS.Services.Common.Models.Submissions.ExecutionContext.Mapping;

public class TaskSkeletonValueResolver<TExecutionDetailsServiceModel>
    : IValueResolver<TExecutionDetailsServiceModel, BaseInputModel, byte[]>
    where TExecutionDetailsServiceModel : BaseExecutionDetailsServiceModel
{
    public byte[] Resolve(
        TExecutionDetailsServiceModel source,
        BaseInputModel destination,
        byte[] destMember,
        ResolutionContext context)
        => source.TaskSkeleton != null && source.TaskSkeleton.Length > 0
            ? source.TaskSkeleton
            : source.TaskSkeletonAsString!.Compress();
}