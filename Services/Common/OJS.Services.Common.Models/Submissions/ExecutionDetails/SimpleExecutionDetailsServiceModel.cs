namespace OJS.Services.Common.Models.Submissions.ExecutionDetails
{
    using AutoMapper;
    using OJS.Services.Common.Models.Submissions.ExecutionContext.Mapping;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class SimpleExecutionDetailsServiceModel
        : BaseExecutionDetailsServiceModel,
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
