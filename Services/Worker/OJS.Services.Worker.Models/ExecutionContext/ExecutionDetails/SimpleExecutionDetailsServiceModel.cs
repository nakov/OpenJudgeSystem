using OJS.Services.Worker.Models.ExecutionContext.Mapping;

namespace OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails
{
    using OJS.Workers.ExecutionStrategies.Models;

    public class SimpleExecutionDetailsServiceModel
        : BaseExecutionDetailsServiceModel,
            IMapTo<SimpleInputModel>,
            IMapExplicitly
    {
        public string Input { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<SimpleExecutionDetailsServiceModel, SimpleInputModel>()
                .ForMember(
                    m => m.TaskSkeleton,
                    opt => opt.ResolveUsing<TaskSkeletonValueResolver<SimpleExecutionDetailsServiceModel>>());
    }
}
