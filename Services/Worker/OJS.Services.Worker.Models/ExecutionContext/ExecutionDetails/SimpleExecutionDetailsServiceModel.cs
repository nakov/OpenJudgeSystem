namespace OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails
{
    using AutoMapper;
    using OJS.Services.Worker.Models.ExecutionContext.Mapping;
    using OJS.Workers.ExecutionStrategies.Models;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SimpleExecutionDetailsServiceModel
        : BaseExecutionDetailsServiceModel,
            IMapTo<SimpleInputModel>,
            IMapExplicitly
    {
        public string? Input { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<SimpleExecutionDetailsServiceModel, SimpleInputModel>()
                .ForMember(
                    m => m.TaskSkeleton,
                    opt => opt.MapFrom<TaskSkeletonValueResolver<SimpleExecutionDetailsServiceModel>>());
    }
}
