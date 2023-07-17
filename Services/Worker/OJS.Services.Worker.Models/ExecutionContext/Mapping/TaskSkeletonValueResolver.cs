namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using AutoMapper;
using OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails;
using OJS.Workers.Common.Extensions;
using OJS.Workers.ExecutionStrategies.Models;

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